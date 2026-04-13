# Findly 💎

> **Semantic document search & summarization for colleges**

Findly is an intelligent document management system that enables students and educators to upload, search, and summarize academic documents using advanced AI-powered semantic search. Built with modern web technologies, Findly makes finding relevant information across multiple documents effortless.

---

## ✨ Features

- 🔐 **Role-Based Access Control**: Separate access for Students, Teachers, and Admins
- 📄 **Document Upload**: Support for PDF documents with file type and size validation
- 🔍 **Semantic Search**: AI-powered search that understands context and meaning
- 📊 **Auto Summarization**: Generate concise summaries of search results using OpenAI
- 👤 **User Authentication**: Secure JWT-based authentication system
- 🎯 **Smart Filtering**: Filter documents by course, semester, and relevance
- 💾 **Document Management**: Easy upload and organization of academic materials

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.14** - Core language
- **JWT (python-jose)** - Authentication & authorization
- **PyMuPDF** - PDF text extraction
- **scikit-learn** - TF-IDF vectorization for semantic search
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - Core language

### Additional Tools
- **Git** - Version control
- **npm** - Package management

---

## 📁 Project Structure

```
Findly/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py         # API tests
│   └── add_sample_docs.py  # Sample data generator
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind configuration
├── .gitignore
└── README.md
```
