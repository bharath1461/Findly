from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
import shutil, json, fitz, os, re
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import numpy as np

# Load environment variables
load_dotenv()

# -------- CONFIG --------
SECRET_KEY = os.getenv("SECRET_KEY", "findly_secret_key_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
UPLOAD_DIR = Path("uploads")
DATA_FILE = Path("data.json")
USER_FILE = Path("users.json")
MAX_FILE_SIZE_MB = 10  # ✅ 10 MB limit
ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"]
DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "ADMIN", "GENERAL"]
DOCUMENT_TYPES = ["Project Report", "Research Paper", "Notes", "Assignment", "Circular", "Letter", "Meeting Minutes", "Thesis", "Lab Report", "Other"]

# Optional: OpenAI Client
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception:
    client = None

app = FastAPI(title="Findly Backend 💎")

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
UPLOAD_DIR.mkdir(exist_ok=True)

# -------- boot files --------
if not DATA_FILE.exists():
    DATA_FILE.write_text("[]", encoding="utf-8")

if not USER_FILE.exists():
    USER_FILE.write_text(
        json.dumps(
            [
                {
                    "email": "admin@findly.com",
                    "name": "Admin",
                    "password": pwd_context.hash("admin123"),
                    "role": "admin",
                    "branch": None,
                    "semester": None,
                }
            ],
            indent=2,
        ),
        encoding="utf-8",
    )

# -------- models --------
class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"
    branch: Optional[str] = None
    semester: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ChatQuery(BaseModel):
    query: str = Field(..., description="Natural language query")
    filters: Optional[Dict[str, Any]] = Field(default=None, description="Optional filters")


class DocumentMetadata(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    document_type: Optional[str] = None
    tags: Optional[List[str]] = None


# -------- utils --------
def load_users() -> list:
    return json.loads(USER_FILE.read_text(encoding="utf-8"))


def save_users(users: list) -> None:
    USER_FILE.write_text(json.dumps(users, indent=2), encoding="utf-8")


def load_data() -> list:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save_data(items: list) -> None:
    DATA_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")


def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {**data, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="❌ Session expired or invalid. Please login again.")


def extract_text_from_pdf(pdf_path: Path) -> str:
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text("text")
    except Exception as e:
        text = f"[Error reading PDF: {e}]"
    return text.strip()


def extract_text_from_docx(docx_path: Path) -> str:
    try:
        import docx
        doc = docx.Document(docx_path)
        text = "\n".join([p.text for p in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"[Error reading DOCX: {e}]"


def generate_summary_and_category(text: str):
    """Uses OpenAI (if available) to auto summarize and extract metadata."""
    if client is None:
        return "AI summarization disabled (no key)", "Others", {}

    try:
        short_text = text[:6000]
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert at analyzing academic and institutional documents. Extract key information and provide structured metadata."},
                {"role": "user", "content": f"""Analyze this document and provide:
1. A concise summary (3-5 bullet points)
2. Document type (Project Report, Research Paper, Notes, Assignment, Circular, Letter, Meeting Minutes, Thesis, Lab Report, or Other)
3. Department/Branch if mentioned (CSE, ECE, EEE, MECH, CIVIL, IT, ADMIN, or GENERAL)
4. Year if mentioned (extract 4-digit year)
5. Key topics/tags (3-5 keywords)

Format response as JSON:
{{
  "summary": "bullet point summary",
  "document_type": "type",
  "department": "dept or null",
  "year": year_number_or_null,
  "tags": ["tag1", "tag2"]
}}

Document text:
{short_text}"""},
            ],
        )
        result = response.choices[0].message.content.strip()
        # Try to parse JSON response
        try:
            result_json = json.loads(result)
            return (
                result_json.get("summary", "Summary not available"),
                result_json.get("document_type", "Other"),
                {
                    "department": result_json.get("department"),
                    "year": result_json.get("year"),
                    "tags": result_json.get("tags", []),
                }
            )
        except:
            return result, "Document", {}
    except Exception as e:
        print("OpenAI Error:", e)
        return "Summary error", "Others", {}


# -------- routes --------
@app.get("/")
def health():
    return {"message": "✅ Findly backend is running!"}


@app.post("/signup")
def signup(payload: SignupIn):
    users = load_users()
    if any(u["email"] == payload.email for u in users):
        raise HTTPException(status_code=400, detail="❌ Email already registered. Please use a different email or login.")

    users.append(
        {
            "name": payload.name,
            "email": payload.email,
            "password": pwd_context.hash(payload.password),
            "role": payload.role,
            "branch": payload.branch if payload.role == "student" else None,
            "semester": payload.semester if payload.role == "student" else None,
        }
    )
    save_users(users)
    return {"message": "Registered successfully"}


@app.post("/login")
def login(payload: LoginIn):
    users = load_users()
    for u in users:
        if u["email"] == payload.email and pwd_context.verify(payload.password, u["password"]):
            token = create_access_token(
                {
                    "sub": u["email"],
                    "role": u["role"],
                    "branch": u.get("branch"),
                    "semester": u.get("semester"),
                    "name": u.get("name", ""),
                }
            )
            return {
                "access_token": token,
                "role": u["role"],
                "branch": u.get("branch"),
                "semester": u.get("semester"),
                "name": u.get("name", ""),
            }

    raise HTTPException(status_code=401, detail="❌ Invalid email or password. Please check your credentials and try again.")


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), token: str = Form(...)):
    user = verify_token(token)

    # ✅ Check file type
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Invalid file type '{ext}'. Only PDF, DOCX, and TXT files are allowed.",
        )

    # ✅ Check file size
    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"❌ File too large ({file_size_mb:.2f} MB). Maximum file size is {MAX_FILE_SIZE_MB} MB. Please upload a smaller file.",
        )

    # Save file
    safe_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    file_path = UPLOAD_DIR / safe_name
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text based on type
    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)
    else:
        text = extract_text_from_docx(file_path)

    summary, category, metadata = generate_summary_and_category(text)

    data = load_data()
    data.append(
        {
            "filename": safe_name,
            "summary": summary,
            "category": category,
            "department": metadata.get("department"),
            "year": metadata.get("year"),
            "tags": metadata.get("tags", []),
            "uploader": user["sub"],
            "role": user["role"],
            "branch": user.get("branch"),
            "semester": user.get("semester"),
            "timestamp": datetime.now().isoformat(),
            "text": text[:10000],  # Store first 10k chars for search
        }
    )
    save_data(data)

    return {"message": "Uploaded successfully", "summary": summary, "category": category, "metadata": metadata}


@app.get("/documents")
def list_documents():
    return load_data()


@app.get("/search")
def search(query: str):
    """Basic TF-IDF search for documents"""
    data = load_data()
    if not data:
        return []
    docs = [d["text"] for d in data]
    vectorizer = TfidfVectorizer().fit(docs + [query])
    matrix = vectorizer.transform(docs + [query])
    similarity = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    ranked = sorted(zip(similarity, data), reverse=True)
    return [r[1] for r in ranked[:5]]


@app.post("/chat-search")
async def chat_search(payload: ChatQuery, authorization: Optional[str] = Header(None)):
    """
    Natural language search endpoint that understands queries like:
    - 'Show AI project reports from 2023'
    - 'Find CSE notes from last semester'
    - 'Research papers on machine learning'
    Also supports keyword search in document text, summaries, and tags
    """
    query = payload.query.lower()
    filters = payload.filters or {}
    
    # Extract filters from natural language query
    year_match = re.search(r'\b(20\d{2})\b', query)
    extracted_year = int(year_match.group(1)) if year_match else None
    
    extracted_dept = None
    for dept in DEPARTMENTS:
        if dept.lower() in query:
            extracted_dept = dept
            break
    
    extracted_type = None
    for doc_type in DOCUMENT_TYPES:
        if doc_type.lower() in query:
            extracted_type = doc_type
            break
    
    # Load and filter documents
    data = load_data()
    if not data:
        return {"results": [], "total": 0, "query_understanding": {}}
    
    # Apply filters
    filtered_data = data
    
    if extracted_year or filters.get("year"):
        year_filter = extracted_year or filters.get("year")
        filtered_data = [d for d in filtered_data if d.get("year") == year_filter]
    
    if extracted_dept or filters.get("department"):
        dept_filter = extracted_dept or filters.get("department")
        filtered_data = [d for d in filtered_data if d.get("department") == dept_filter]
    
    if extracted_type or filters.get("document_type"):
        type_filter = extracted_type or filters.get("document_type")
        filtered_data = [d for d in filtered_data if d.get("category") == type_filter]
    
    # Keyword search in document content, summaries, filenames, and tags
    if filtered_data:
        # Build searchable text from multiple fields
        docs_text = []
        for d in filtered_data:
            searchable_parts = [
                d.get('summary', ''),
                d.get('text', ''),
                d.get('filename', ''),
                d.get('category', ''),
                ' '.join(d.get('tags', [])) if d.get('tags') else ''
            ]
            docs_text.append(' '.join(filter(None, searchable_parts)))
        
        try:
            vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
            matrix = vectorizer.fit_transform(docs_text + [query])
            similarity = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
            
            # Combine with simple keyword matching for better results
            query_keywords = set(query.lower().split())
            keyword_scores = []
            for doc_text in docs_text:
                doc_words = set(doc_text.lower().split())
                keyword_match = len(query_keywords.intersection(doc_words)) / len(query_keywords) if query_keywords else 0
                keyword_scores.append(keyword_match)
            
            # Combine TF-IDF similarity with keyword matching (weighted average)
            combined_scores = [(0.6 * sim + 0.4 * kw) for sim, kw in zip(similarity, keyword_scores)]
            
            ranked = sorted(zip(combined_scores, filtered_data), key=lambda x: x[0], reverse=True)
            results = [r[1] for r in ranked[:10] if r[0] > 0.01]  # Minimum similarity threshold
        except Exception as e:
            print(f"Search error: {e}")
            # Fallback to simple keyword matching
            results = []
            query_keywords = query.lower().split()
            for doc in filtered_data:
                doc_text = f"{doc.get('summary', '')} {doc.get('text', '')} {doc.get('filename', '')}".lower()
                if any(keyword in doc_text for keyword in query_keywords):
                    results.append(doc)
            results = results[:10]
    else:
        results = []
    
    return {
        "results": results,
        "total": len(results),
        "query_understanding": {
            "extracted_year": extracted_year,
            "extracted_department": extracted_dept,
            "extracted_type": extracted_type,
        },
        "filters_applied": {
            "year": extracted_year or filters.get("year"),
            "department": extracted_dept or filters.get("department"),
            "document_type": extracted_type or filters.get("document_type"),
        }
    }


@app.get("/stats")
def get_stats():
    """Get platform statistics"""
    data = load_data()
    users = load_users()
    
    # Calculate statistics
    total_docs = len(data)
    docs_by_dept = {}
    docs_by_type = {}
    docs_by_year = {}
    
    for doc in data:
        dept = doc.get("department", "Unknown")
        docs_by_dept[dept] = docs_by_dept.get(dept, 0) + 1
        
        doc_type = doc.get("category", "Other")
        docs_by_type[doc_type] = docs_by_type.get(doc_type, 0) + 1
        
        year = doc.get("year", "Unknown")
        docs_by_year[str(year)] = docs_by_year.get(str(year), 0) + 1
    
    return {
        "total_documents": total_docs,
        "total_users": len(users),
        "documents_by_department": docs_by_dept,
        "documents_by_type": docs_by_type,
        "documents_by_year": docs_by_year,
    }


@app.get("/filters")
def get_available_filters():
    """Get available filter options"""
    data = load_data()
    
    departments = set()
    years = set()
    types = set()
    
    for doc in data:
        if doc.get("department"):
            departments.add(doc["department"])
        if doc.get("year"):
            years.add(doc["year"])
        if doc.get("category"):
            types.add(doc["category"])
    
    return {
        "departments": sorted(list(departments)),
        "years": sorted(list(years), reverse=True),
        "document_types": sorted(list(types)),
    }


app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
