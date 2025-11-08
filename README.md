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

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- npm or yarn
- Git

### Backend Setup

1. **Navigate to the project directory**
   ```bash
   cd Findly
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server**
   ```bash
   python main.py
   ```
   
   Or using uvicorn:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

4. **Backend will be running at**: `http://127.0.0.1:8000`
   - API Documentation: `http://127.0.0.1:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Frontend will be running at**: `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the root directory (optional for future features):

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> **Note**: Currently, the application uses default values. For production deployment, set secure environment variables.

---

## 📡 API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login and receive JWT token

### Documents
- `POST /upload` - Upload a PDF document (requires authentication)
- `GET /search` - Search documents with semantic understanding
- `GET /documents` - List all uploaded documents

### User Management
- `GET /users/me` - Get current user information

For detailed API documentation, visit: `http://127.0.0.1:8000/docs` when the backend is running.

---

## 👥 User Roles

### Student
- Upload and search documents
- View summaries
- Access course materials

### Teacher
- All student features
- Manage course documents
- Upload learning materials

### Admin
- All features
- User management
- System configuration

---

## 🎬 Demo

> **Coming Soon**: Live demo will be deployed and linked here.

For now, you can run the application locally following the setup instructions above.

---

## 🗺️ Roadmap & Future Work

- [ ] **Deploy to Cloud**
  - Frontend: Vercel/Netlify
  - Backend: Railway/Render/Heroku
  
- [ ] **Enhanced Features**
  - OpenAI integration for advanced summarization
  - Document sharing between users
  - Advanced analytics dashboard
  - Support for more file types (DOCX, TXT, etc.)
  
- [ ] **Improved Search**
  - Vector embeddings for better semantic search
  - Search history and saved searches
  - Document categorization and tagging
  
- [ ] **Mobile Support**
  - Responsive design improvements
  - Progressive Web App (PWA)
  
- [ ] **Collaboration**
  - Document annotations
  - Comments and discussions
  - Real-time collaboration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Bharath** - [bharath1461](https://github.com/bharath1461)

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the powerful UI library
- OpenAI for future AI integration possibilities
- The open-source community

---

**Made with ❤️ for better education**
