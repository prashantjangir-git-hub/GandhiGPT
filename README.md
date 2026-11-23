# GandhiGPT

A small character-level Transformer language model trained on cleaned text from Mahatma Gandhi's writings.

This project is an educational implementation of a GPT-style language model, inspired by Andrej Karpathy's tutorial, [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY).

## About the Project

GandhiGPT learns patterns in text by predicting the next character in a sequence. It uses a decoder-only Transformer architecture with self-attention.

The goal of this project is to understand the fundamentals of GPT-style pretraining and experiment with training a language model on a different text corpus.

**Important:** GandhiGPT is an experimental text generator. It is not an official representation of Mahatma Gandhi's views, a reliable historical reference, or a question-answering chatbot.

## Model Details

| Setting | Value |
|---|---|
| Architecture | Decoder-only Transformer |
| Tokenization | Character-level |
| Vocabulary size | 205 characters |
| Embedding size | 64 |
| Attention heads | 4 |
| Transformer layers | 4 |
| Context length | 32 characters |
| Training iterations | 5,000 |
| Parameters | Approximately 228,000 |
| Training/validation split | 90% / 10% |

The model was trained using PyTorch.

## Dataset

The original text data was obtained from:

[AbelTheGeorge/Gandhi-Dataset](https://github.com/AbelTheGeorge/Gandhi-Dataset)

The data was cleaned and prepared for training. The resulting text file was named `gandhi_clean.txt`.

See [`data/README.md`](data/README.md) for dataset information and attribution.

The original dataset is not included in this repository.

## Repository Structure

```text
GandhiGPT/
├── README.md
├── gandhi_gpt.ipynb
├── gandhi_generate.py
├── requirements.txt
├── checkpoints/
│   ├── README.md
│   └── gandhi_gpt_checkpoint.pth
└── data/
    └── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd GandhiGPT
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's actual GitHub URL.

### 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 3. Generate text

Run:

```bash
python gandhi_generate.py --prompt "Truth" --tokens 300
```

You can change the prompt and number of generated characters.

The trained checkpoint must be available at:

```text
checkpoints/gandhi_gpt_checkpoint.pth
```

## Training

The training notebook is:

`gandhi_gpt.ipynb`

Open it in Google Colab or Jupyter Notebook.

To train the model from scratch, you will also need the cleaned dataset file, `gandhi_clean.txt`, in the expected location.

## Example

A sample prompt:

```text
Truth
```

The model generates a continuation based on patterns learned during training.

Generated text may contain grammatical errors, repetition, or meaningless sequences. This is expected from a small character-level experimental model.

## Future Plans

- Build a simple web interface for GandhiGPT.
- Make text generation accessible through a browser.
- Explore hosting the frontend using GitHub Pages.

## Acknowledgements

- Andrej Karpathy for the educational GPT implementation tutorial.
- AbelTheGeorge for the Gandhi dataset.
- Publications Division, Government of India, for the underlying collected works.

## Disclaimer

This is an independent educational project. It is not affiliated with or endorsed by the Government of India or the Publications Division.

Please consult the original dataset repository for its usage terms.

## Author

Created by Prashant Jangir as a learning project to explore Transformer architecture and language model pretraining.
