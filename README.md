# GandhiGPT

### A small GPT-style language model trained on writings associated with Mahatma Gandhi.

[**🌐 Live Website**](https://prashantjangir-git-hub.github.io/GandhiGPT/) · [**💻 GitHub Repository**](https://github.com/prashantjangir-git-hub/GandhiGPT) · [**⚙️ Backend API**](https://gandhigpt-api.onrender.com/health)

GandhiGPT is an educational project that explores how GPT-style language models work, from preparing a text dataset to training a Transformer and generating text through a web application.

---

## 🌿 Try GandhiGPT

Visit the live application:

**[https://prashantjangir-git-hub.github.io/GandhiGPT/](https://prashantjangir-git-hub.github.io/GandhiGPT/)**

Enter a prompt and let the model generate a continuation based on patterns it learned during training.

The website includes:
- Interactive text-generation interface
- Live connection to the trained model through a Python API
- Light and dark themes
- Model information and architecture overview
- Training details and dataset attribution
- Responsive layout

---

## 🧠 About the Model

GandhiGPT is a character-level, decoder-only Transformer language model.

It learns by predicting the next character in a sequence. During training, it processes text and learns statistical patterns, structures, and relationships between characters.

Unlike a conventional chatbot, GandhiGPT does not retrieve information or answer questions using a knowledge base. It generates text continuations based on patterns learned from its training data.

### Model specifications

| Specification | Value |
|---|---|
| Architecture | Decoder-only Transformer |
| Tokenization | Character-level |
| Vocabulary size | 205 characters |
| Embedding dimension | 64 |
| Attention heads | 4 |
| Transformer layers | 4 |
| Context length | 32 characters |
| Training iterations | 5,000 |
| Parameters | Approximately 228K |
| Training/validation split | 90% / 10% |
| Framework | PyTorch |

### Training results

| Metric | Final reported value |
|---|---:|
| Training loss | 1.5976 |
| Validation loss | 1.5955 |

These loss values describe the model's performance on its character-prediction training objective. They do not measure factual accuracy or conversational ability.

---

## ⚙️ How It Works

The project follows a simplified GPT-style pretraining pipeline:

1. **Dataset preparation** — Clean and prepare the Gandhi writings text.
2. **Character encoding** — Convert characters into numerical token IDs.
3. **Embedding** — Map token IDs into learned vector representations.
4. **Self-attention** — Let the model learn relationships between characters in the context.
5. **Transformer blocks** — Process the sequence through multiple decoder layers.
6. **Next-character prediction** — Predict a probability distribution for the next character.
7. **Text generation** — Repeatedly sample the next character to produce a continuation.

---

## 📚 Dataset

The model was trained on a cleaned text dataset containing approximately:

- **79.4 million characters** in the original prepared text.
- **205 unique characters** in the model vocabulary.
- **90,915 lines** in the original dataset.

### Dataset source

The original dataset was obtained from:

[AbelTheGeorge/Gandhi-Dataset](https://github.com/AbelTheGeorge/Gandhi-Dataset)

The text was cleaned and prepared for model training. The resulting file was named `gandhi_clean.txt`.

The original dataset is not included in this repository.

For more information about the dataset and attribution, see [`data/README.md`](data/README.md).

---

## 🖥️ Project Architecture

GandhiGPT consists of three main parts:

| Component | Technology | Purpose |
|---|---|---|
| Model training | Python, PyTorch, Google Colab | Train the Transformer |
| Backend | Python, Flask, Gunicorn | Load the checkpoint and generate text |
| Frontend | HTML, CSS, JavaScript | Provide the interactive website |
| Hosting | Render and GitHub Pages | Deploy the backend and frontend |

### Request flow

```text
          User enters a prompt
                   |
                   v
          GitHub Pages Website
             HTML / CSS / JS
                   |
                   v
             Flask API
              /generate
                   |
                   v
          Trained GandhiGPT
          PyTorch Checkpoint
                   |
                   v
          Generated text response
                   |
                   v
          Displayed on website
```

### Live backend

The Flask API is deployed on Render.

Health endpoint:

`https://gandhigpt-api.onrender.com/health`

Generation endpoint:

`POST https://gandhigpt-api.onrender.com/generate`

The generation endpoint accepts a prompt and token count and returns generated text.

---

## 📁 Repository Structure

```text
GandhiGPT/
│
├── index.html
├── style.css
├── script.js
├── favicon.svg
│
├── app.py
├── gandhi_generate.py
├── gandhi_gpt.ipynb
├── requirements.txt
│
├── checkpoints/
│   ├── README.md
│   └── gandhi_gpt_checkpoint.pth
│
├── data/
│   └── README.md
│
└── README.md
```

---

## 🚀 Run GandhiGPT Locally

### 1. Clone the repository

```bash
git clone https://github.com/prashantjangir-git-hub/GandhiGPT.git
cd GandhiGPT
```

### 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 3. Generate text from the trained model

Make sure the checkpoint is available at:

```text
checkpoints/gandhi_gpt_checkpoint.pth
```

Run:

```bash
python gandhi_generate.py --prompt "Truth" --tokens 300
```

You can change the prompt and number of generated characters.

### 4. Run the web backend locally

```bash
python app.py
```

The Flask API should be available at the local address configured by the application.

The frontend can be opened through a local development server or hosted static page. For local frontend testing, configure the API URL in `script.js` to point to your local backend.

### 5. Train from scratch

Open:

```text
gandhi_gpt.ipynb
```

Run it in Google Colab or Jupyter Notebook.

To reproduce training, you will also need the cleaned dataset file `gandhi_clean.txt` in the location expected by the notebook.

---

## ⚠️ Limitations

GandhiGPT is an experimental educational model, not a production chatbot.

- It is a small model with approximately 228K parameters.
- It generates character-level text rather than understanding language like a modern large language model.
- Generated output may contain grammatical errors, repetition, incomplete sentences, or meaningless sequences.
- It does not perform factual question answering or internet searches.
- Generated text is not verified historical material.
- Generated output must not be presented as an authentic quotation or statement by Mahatma Gandhi.

The purpose of this project is to demonstrate the foundations of GPT-style pretraining, not to reproduce Gandhi's actual voice, opinions, or beliefs.

---

## 🙏 Acknowledgements

- **Andrej Karpathy** — For the educational GPT implementation tutorial.
- **AbelTheGeorge** — For the original Gandhi dataset repository.
- **Publications Division, Government of India** — For the underlying collected works referenced in the dataset attribution.

Please consult the original dataset repository and relevant source publications for applicable usage and redistribution terms.

---

## 📌 Disclaimer

GandhiGPT is an independent educational project. It is not affiliated with, endorsed by, or officially associated with Mahatma Gandhi, the Government of India, or the Publications Division.

The model's generated output is machine-generated experimental text and should not be attributed to Mahatma Gandhi.

---

## 👨‍💻 Author

**Prashant Jangir**

Created as a learning project to explore Transformer architecture, GPT-style pretraining, dataset preparation, and deployment of a language model as a web application.

If you find this project interesting, feel free to explore the repository and experiment with the code.

**[⭐ Star the repository on GitHub](https://github.com/prashantjangir-git-hub/GandhiGPT)**
