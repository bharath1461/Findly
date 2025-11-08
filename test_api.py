"""
Findly Backend Test Script
Tests the main API endpoints to verify functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test server health"""
    print("\n🔍 Testing server health...")
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_login():
    """Test login with default admin"""
    print("\n🔐 Testing login...")
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": "admin@findly.com",
            "password": "admin123"
        }
    )
    print(f"✅ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Token received: {data['access_token'][:30]}...")
        print(f"Role: {data['role']}")
        return data['access_token']
    return None

def test_signup():
    """Test creating a new student account"""
    print("\n📝 Testing signup...")
    response = requests.post(
        f"{BASE_URL}/signup",
        json={
            "name": "Test Student",
            "email": f"student{hash('test')%1000}@college.edu",
            "password": "test123",
            "role": "student",
            "branch": "CSE",
            "semester": "6"
        }
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ {response.json()['message']}")
    else:
        print(f"⚠️ {response.json()}")

def test_stats():
    """Test statistics endpoint"""
    print("\n📊 Testing statistics...")
    response = requests.get(f"{BASE_URL}/stats")
    print(f"✅ Status: {response.status_code}")
    if response.status_code == 200:
        stats = response.json()
        print(f"Total Documents: {stats['total_documents']}")
        print(f"Total Users: {stats['total_users']}")
        print(f"Documents by Department: {stats['documents_by_department']}")

def test_filters():
    """Test available filters"""
    print("\n🔍 Testing filters...")
    response = requests.get(f"{BASE_URL}/filters")
    print(f"✅ Status: {response.status_code}")
    if response.status_code == 200:
        filters = response.json()
        print(f"Available Departments: {filters['departments']}")
        print(f"Available Years: {filters['years']}")
        print(f"Document Types: {filters['document_types']}")

def test_chat_search():
    """Test natural language search"""
    print("\n💬 Testing chat search...")
    
    queries = [
        "Show AI project reports from 2023",
        "Find CSE notes",
        "Research papers on machine learning"
    ]
    
    for query in queries:
        print(f"\n  Query: '{query}'")
        response = requests.post(
            f"{BASE_URL}/chat-search",
            json={"query": query}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Found {data['total']} results")
            print(f"  Understood: {data['query_understanding']}")
        else:
            print(f"  ⚠️ Error: {response.status_code}")

def test_documents():
    """Test listing documents"""
    print("\n📄 Testing document list...")
    response = requests.get(f"{BASE_URL}/documents")
    print(f"✅ Status: {response.status_code}")
    if response.status_code == 200:
        docs = response.json()
        print(f"Total documents: {len(docs)}")
        if docs:
            print(f"\nSample document:")
            sample = docs[0]
            print(f"  Filename: {sample.get('filename', 'N/A')}")
            print(f"  Category: {sample.get('category', 'N/A')}")
            print(f"  Department: {sample.get('department', 'N/A')}")
            print(f"  Year: {sample.get('year', 'N/A')}")

def main():
    print("=" * 60)
    print("🚀 Findly Backend API Test Suite")
    print("=" * 60)
    
    try:
        # Test 1: Health check
        if not test_health():
            print("\n❌ Server is not running!")
            print("Start the server with: uvicorn main:app --reload")
            return
        
        # Test 2: Login
        token = test_login()
        
        # Test 3: Signup
        test_signup()
        
        # Test 4: Statistics
        test_stats()
        
        # Test 5: Available filters
        test_filters()
        
        # Test 6: List documents
        test_documents()
        
        # Test 7: Chat search
        test_chat_search()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
        print("\n📚 Next Steps:")
        print("1. Add your OpenAI API key to .env for AI features")
        print("2. Upload some documents via /upload endpoint")
        print("3. Try natural language search queries")
        print("4. Check out the full API docs at http://localhost:8000/docs")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to server!")
        print("Make sure the server is running:")
        print("  uvicorn main:app --reload --port 8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
