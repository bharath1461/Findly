# 💎 Findly — AI Document Search & Summarization

🚀 Findly is an AI-powered document management platform that allows users to upload PDFs, search content intelligently, and generate real-time summaries.

> ⚡ Findly v2.0 — Now faster, smarter, and more interactive.

---

## 🌐 Live Demo
👉 https://bharath1461.github.io/Findly/

---

## 📖 About the Project

Findly helps students and educators efficiently manage academic documents by enabling semantic search and AI-powered summarization.  
Instead of manually scanning files, users can instantly retrieve relevant information and generate concise summaries.

---

## ✨ Features

- 📄 Upload and process PDF documents  
- 🔍 Intelligent search within documents  
- ⚡ AI-powered summary generation  
- 📊 Document stats (pages, words, characters)  
- 📈 Real-time PDF extraction progress  
- 🌗 Dark/Light theme toggle  
- 🔔 Toast notifications for user feedback  
- ⌨️ Keyboard shortcuts for faster workflow  

---

## ⚙️ How It Works

1. Upload a PDF document  
2. System extracts text using pdf.js  
3. Search for relevant content using keywords  
4. Generate AI summaries using OpenAI  
5. View results instantly in a clean UI  

---

## 🚀 Findly v2.0 — Upgrade Highlights

### 🐛 Bug Fixes

| Issue | Fix |
|------|-----|
| PDF extraction unreliable | Integrated **pdf.js** for accurate extraction |
| Deprecated OpenAI model | Upgraded to **gpt-4o-mini** |
| XSS vulnerability | Secured using `escapeHtml()` |
| Error persistence issue | Cleared on every new action |
| Search without upload | Added validation with toast alerts |
| Missing API key validation | Added `sk-` prefix validation |

---

### ✨ UI/UX Enhancements

- 🎨 Animated hero background with floating orbs  
- 🌗 Theme toggle with persistence  
- 🔔 Toast notifications (success/error/info)  
- 📊 Progress bar for PDF processing  
- 📄 Document stats panel  
- ⌨️ Keyboard shortcuts:
  - `Ctrl + K` → Focus search  
  - `Ctrl + Enter` → Generate summary  
- 🧠 Micro-animations across UI  
- ⌨️ Typing cursor for streaming output  

---

### 🤖 OpenAI Integration

- ⚡ Model: **gpt-4o-mini**  
- 🔄 Streaming summary output (real-time text)  
- 📈 Improved API error handling  
- 🧠 Context window: 4000 characters  

---

## 🛠 Tech Stack

### Frontend
- HTML, CSS, JavaScript  
- pdf.js (PDF processing)

### AI Integration
- OpenAI API (gpt-4o-mini)

### Features & Tools
- LocalStorage (theme persistence)  
- Fetch API (API calls)  

---

## 📂 Project Structure


Findly/
│── index.html
│── style.css
│── script.js


---

## ▶️ Run Locally

1. Clone the repository:
   
git clone https://github.com/bharath1461/Findly.git
cd Findly
Start a local server:
npx serve

or

python -m http.server 3000
Open in browser:
http://localhost:3000
🔐 Environment Setup

Add your OpenAI API key in script.js:

const API_KEY = "YOUR_API_KEY";
🎯 Goal

The goal of Findly is to simplify document navigation and make information retrieval faster using AI-powered tools.

🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

📬 Contact
📧 Email: bharath00127@gmail.com
🔗 LinkedIn: https://linkedin.com/in/bharath00146

⭐ If you like this project, consider giving it a star!
