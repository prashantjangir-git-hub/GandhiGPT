import os
from pathlib import Path

import torch
import torch.nn as nn
from torch.nn import functional as F
from flask import Flask, jsonify, request
from flask_cors import CORS

# Keep CPU thread usage modest on small free hosting instances.
torch.set_num_threads(1)
DEVICE = "cpu"

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": [
        "https://prashantjangir-git-hub.github.io",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]}},
)

CHECKPOINT_PATH = Path(__file__).parent / "checkpoints" / "gandhi_gpt_checkpoint.pth"
model = None
stoi = None
itos = None
block_size = None
load_error = None


class Head(nn.Module):
    def __init__(self, head_size, n_embd, block_size, dropout):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer("tril", torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        _, T, _ = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * k.size(-1) ** -0.5
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float("-inf"))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        return wei @ v


class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size, n_embd, block_size, dropout):
        super().__init__()
        self.heads = nn.ModuleList([
            Head(head_size, n_embd, block_size, dropout)
            for _ in range(num_heads)
        ])
        self.proj = nn.Linear(n_embd, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        return self.dropout(self.proj(out))


class FeedFoward(nn.Module):
    def __init__(self, n_embd, dropout):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.ReLU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.net(x)


class Block(nn.Module):
    def __init__(self, n_embd, n_head, block_size, dropout):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size, n_embd, block_size, dropout)
        self.ffwd = FeedFoward(n_embd, dropout)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x


class BigramLanguageModel(nn.Module):
    def __init__(self, vocab_size, n_embd, block_size, n_head, n_layer, dropout):
        super().__init__()
        self.block_size = block_size
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[
            Block(n_embd, n_head, block_size, dropout)
            for _ in range(n_layer)
        ])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx):
        _, T = idx.shape
        tok_emb = self.token_embedding_table(idx)
        pos_emb = self.position_embedding_table(torch.arange(T, device=idx.device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        return self.lm_head(x)

    @torch.no_grad()
    def generate(self, idx, max_new_tokens):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -self.block_size:]
            logits = self(idx_cond)
            logits = logits[:, -1, :]
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, idx_next), dim=1)
        return idx


def load_model():
    global model, stoi, itos, block_size, load_error
    if not CHECKPOINT_PATH.exists():
        load_error = f"Checkpoint not found: {CHECKPOINT_PATH}"
        return

    try:
        # This checkpoint is the user's own trusted training output.
        checkpoint = torch.load(
            CHECKPOINT_PATH,
            map_location=DEVICE,
            weights_only=False,
        )
        chars = checkpoint["chars"]
        stoi = {ch: i for i, ch in enumerate(chars)}
        itos = {i: ch for i, ch in enumerate(chars)}
        block_size = checkpoint["block_size"]

        model = BigramLanguageModel(
            vocab_size=len(chars),
            n_embd=checkpoint["n_embd"],
            block_size=block_size,
            n_head=checkpoint["n_head"],
            n_layer=checkpoint["n_layer"],
            dropout=checkpoint["dropout"],
        ).to(DEVICE)
        model.load_state_dict(checkpoint["model_state_dict"])
        model.eval()
        load_error = None
    except Exception as exc:
        load_error = str(exc)
        model = None


load_model()


@app.get("/")
def home():
    return jsonify({
        "name": "GandhiGPT API",
        "status": "ready" if model is not None else "model_unavailable",
        "message": "Use POST /generate with JSON: {\"prompt\":\"Truth\", \"tokens\":100}.",
    })


@app.get("/health")
def health():
    return jsonify({
        "ok": model is not None,
        "model_loaded": model is not None,
        "error": load_error,
    }), (200 if model is not None else 503)


@app.post("/generate")
def generate():
    if model is None:
        return jsonify({"error": "The model is not loaded.", "details": load_error}), 503

    payload = request.get_json(silent=True) or {}
    prompt = payload.get("prompt", "")
    tokens = payload.get("tokens", 200)

    if not isinstance(prompt, str) or not prompt.strip():
        return jsonify({"error": "Please provide a non-empty prompt."}), 400

    try:
        tokens = int(tokens)
    except (TypeError, ValueError):
        return jsonify({"error": "tokens must be an integer."}), 400

    tokens = max(1, min(tokens, 500))

    unknown = sorted(set(ch for ch in prompt if ch not in stoi))
    if unknown:
        return jsonify({
            "error": "Your prompt contains characters that are not in this model's vocabulary.",
            "unsupported_characters": unknown,
        }), 400

    try:
        encoded = [stoi[ch] for ch in prompt]
        context = torch.tensor([encoded], dtype=torch.long, device=DEVICE)
        with torch.no_grad():
            output = model.generate(context, tokens)
        generated_text = "".join(itos[i] for i in output[0].tolist())
        return jsonify({"text": generated_text, "prompt": prompt, "tokens": tokens})
    except Exception as exc:
        app.logger.exception("Text generation failed")
        return jsonify({"error": "Text generation failed.", "details": str(exc)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
