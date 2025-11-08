# 🔍 Findly Backend API Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy the example file
copy .env.example .env

# Edit .env and add your OpenAI API key
```

### 3. Run the Server
```bash
uvicorn main:app --reload --port 8000
```

Server will be available at: `http://localhost:8000`

---

## 📌 API Endpoints

### Health Check
```http
GET /
```
**Response:**
```json
{
  "message": "✅ Findly backend is running!"
}
```

---

### 🔐 Authentication

#### Signup
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "secure123",
  "role": "student",
  "branch": "CSE",
  "semester": "6"
}
```

**Roles:** `student`, `teacher`, `admin`

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "secure123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "role": "student",
  "branch": "CSE",
  "semester": "6",
  "name": "John Doe"
}
```

---

### 📤 Upload Document

```http
POST /upload
Content-Type: multipart/form-data

file: [PDF/DOCX file]
token: [access_token from login]
```

**Features:**
- ✅ Automatic text extraction
- ✅ AI-powered summarization
- ✅ Smart categorization (Project Report, Research Paper, Notes, etc.)
- ✅ Department/Year extraction
- ✅ Auto-tagging

**Response:**
```json
{
  "message": "Uploaded successfully",
  "summary": "• Project on AI chatbot\n• Uses GPT-4\n• Final year CSE project",
  "category": "Project Report",
  "metadata": {
    "department": "CSE",
    "year": 2023,
    "tags": ["AI", "chatbot", "GPT-4"]
  }
}
```

---

### 🔍 Search Documents

#### Basic Search
```http
GET /search?query=machine learning
```

Returns top 5 relevant documents using TF-IDF similarity.

#### Chat-Style Search (Recommended)
```http
POST /chat-search
Content-Type: application/json

{
  "query": "Show AI project reports from 2023",
  "filters": {
    "department": "CSE",
    "year": 2023,
    "document_type": "Project Report"
  }
}
```

**Natural Language Queries:**
- "Find CSE notes from last semester"
- "Show research papers on machine learning"
- "Get all project reports from 2022"
- "Find meeting minutes from admin department"

**Response:**
```json
{
  "results": [...],
  "total": 5,
  "query_understanding": {
    "extracted_year": 2023,
    "extracted_department": "CSE",
    "extracted_type": "Project Report"
  },
  "filters_applied": {
    "year": 2023,
    "department": "CSE",
    "document_type": "Project Report"
  }
}
```

---

### 📊 Statistics

```http
GET /stats
```

**Response:**
```json
{
  "total_documents": 150,
  "total_users": 45,
  "documents_by_department": {
    "CSE": 60,
    "ECE": 30,
    "MECH": 25
  },
  "documents_by_type": {
    "Project Report": 50,
    "Research Paper": 40,
    "Notes": 35
  },
  "documents_by_year": {
    "2023": 80,
    "2022": 45,
    "2021": 25
  }
}
```

---

### 🗂️ Get Available Filters

```http
GET /filters
```

Returns all unique departments, years, and document types in the system.

---

### 📋 List All Documents

```http
GET /documents
```

Returns all documents with metadata.

---

## 🎯 Usage Examples

### Example 1: Student Finding Past Projects
```javascript
// Login
const login = await fetch('http://localhost:8000/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@college.edu',
    password: 'password123'
  })
});
const { access_token } = await login.json();

// Search for projects
const search = await fetch('http://localhost:8000/chat-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'AI projects from CSE 2023'
  })
});
const results = await search.json();
console.log(results.results);
```

### Example 2: Teacher Uploading Research Paper
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('token', access_token);

const upload = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData
});
const result = await upload.json();
```

### Example 3: Admin Searching Circulars
```javascript
const search = await fetch('http://localhost:8000/chat-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'office circulars from 2023',
    filters: {
      department: 'ADMIN',
      document_type: 'Circular'
    }
  })
});
```

---

## 🔑 Key Features Implemented

### 1. Smart Document Analysis
- **AI-Powered Summarization**: Automatically generates concise summaries
- **Intelligent Categorization**: Detects document type (project, paper, notes, etc.)
- **Metadata Extraction**: Extracts department, year, and relevant tags

### 2. Natural Language Search
- Understands queries like "Show CSE projects from 2023"
- Extracts filters from plain language
- Combines keyword and semantic search

### 3. Role-Based Access
- **Students**: Upload and search documents
- **Teachers**: Access research papers, course materials
- **Admins**: Manage institutional documents

### 4. Advanced Filtering
- By department (CSE, ECE, MECH, etc.)
- By year (2020, 2021, 2022, 2023...)
- By document type (Project Report, Research Paper, etc.)
- By tags and keywords

---

## 📂 File Structure

```
Findly_backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── .env                # Your actual environment config (create this)
├── data.json           # Document metadata storage
├── users.json          # User accounts storage
└── uploads/            # Uploaded files directory
```

---

## 🚀 Next Steps

### For Frontend Integration:
1. Use `/chat-search` endpoint for main search interface
2. Display query understanding to show extracted filters
3. Implement file upload with progress indicator
4. Show document stats on dashboard
5. Add filter chips for department, year, type

### For Enhanced Search:
1. Add OpenAI API key to `.env` for better summaries
2. Consider adding vector embeddings (Pinecone, Weaviate) for semantic search
3. Implement full-text search with Elasticsearch

### For Production:
1. Change `SECRET_KEY` in .env
2. Set up proper database (PostgreSQL)
3. Add file storage (S3, Google Cloud Storage)
4. Implement rate limiting
5. Add logging and monitoring

---

## 🐛 Troubleshooting

**Issue: AI summarization not working**
- Make sure OPENAI_API_KEY is set in .env
- Check API key is valid and has credits

**Issue: File upload fails**
- Check file size (max 10MB)
- Verify file type (.pdf or .docx)
- Ensure uploads/ directory exists

**Issue: Search returns no results**
- Check if documents are uploaded
- Try simpler queries first
- Verify data.json is not empty

---

## 📞 Support

For questions about the API, check the interactive docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🛡️ Error Responses

### Common Error Codes

**400 Bad Request** - Invalid file type:
```json
{
  "detail": "❌ Invalid file type '.exe'. Only PDF, DOCX, and TXT files are allowed."
}
```

**400 Bad Request** - File too large:
```json
{
  "detail": "❌ File too large (15.32 MB). Maximum file size is 10 MB. Please upload a smaller file."
}
```

**400 Bad Request** - Email already exists:
```json
{
  "detail": "❌ Email already registered. Please use a different email or login."
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "detail": "❌ Invalid email or password. Please check your credentials and try again."
}
```

**401 Unauthorized** - Token expired:
```json
{
  "detail": "❌ Session expired or invalid. Please login again."
}
```

**422 Unprocessable Entity** - Validation error:
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## 📚 Complete Example Flow

### Using cURL

**1. Sign up:**
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@college.edu",
    "password": "password123",
    "role": "student",
    "branch": "CSE",
    "semester": "6"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@college.edu",
    "password": "password123"
  }'
```

**3. Upload document:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@myproject.pdf" \
  -F "token=eyJhbGc..."
```

**4. Search:**
```bash
curl -X POST http://localhost:8000/chat-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning projects from 2023"
  }'
```

### Using JavaScript (Fetch API)

**Login:**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'jane@college.edu',
      password: 'password123'
    })
  });
  const data = await response.json();
  return data.access_token;
};
```

**Upload:**
```javascript
const uploadDocument = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', token);
  
  const response = await fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData
  });
  return await response.json();
};
```

**Search:**
```javascript
const search = async (query) => {
  const response = await fetch('http://localhost:8000/chat-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
};
```

---

## 🔧 Configuration Reference

### Environment Variables (.env)

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
OPENAI_API_KEY=sk-...
```

### File Upload Limits

- **Max file size**: 10 MB
- **Allowed types**: `.pdf`, `.docx`, `.txt`
- **Upload directory**: `./uploads/`

### Supported Values

**Departments:**
- CSE, ECE, EEE, MECH, CIVIL, IT, ADMIN, GENERAL

**Document Types:**
- Project Report, Research Paper, Notes, Assignment
- Circular, Letter, Meeting Minutes, Thesis, Lab Report, Other

**User Roles:**
- student, teacher, admin

---

## ✅ Testing

The repository includes a test script. Run it with:

```bash
python test_api.py
```

This will test all major endpoints and verify functionality.

---

## 🔄 Recent Updates

### Enhanced Error Messages
- ✅ Clear, user-friendly error descriptions
- ✅ Specific validation feedback
- ✅ Helpful suggestions for fixing errors

### Improved File Validation
- ✅ Better file type checking
- ✅ Detailed size limit messages
- ✅ Supported format listing

---

## 📝 Notes

- All endpoints support CORS for local development
- JWT tokens expire after 120 minutes
- Documents are stored locally in `uploads/` directory
- Metadata is saved in `data.json`
- User data is stored in `users.json`
- First 10,000 characters of each document are indexed for search

---

## 🎯 Best Practices

1. **Always validate file size** before uploading
2. **Store JWT tokens securely** (localStorage/sessionStorage)
3. **Handle token expiration** gracefully with re-authentication
4. **Use chat-search** for better results over basic search
5. **Include filters** in search queries for faster results
