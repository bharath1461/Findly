import json
from datetime import datetime

# Sample documents to add to the system
sample_documents = [
    {
        "filename": "20231115_AI_Chatbot_Project.txt",
        "summary": "• AI-based chatbot development using machine learning\n• Technologies: Python, TensorFlow, NLTK\n• Natural language processing implementation\n• Completed by CSE students in 2023",
        "category": "Project Report",
        "department": "CSE",
        "year": 2023,
        "tags": ["AI", "chatbot", "machine learning", "NLP", "Python", "TensorFlow"],
        "uploader": "admin@findly.com",
        "role": "admin",
        "branch": None,
        "semester": None,
        "timestamp": "2023-11-15T10:30:00",
        "text": "Sample AI Project Report - This document covers the development of an AI-based chatbot using machine learning and natural language processing. Technologies used: Python, TensorFlow, NLTK. Completed in 2023 by CSE students. The project demonstrates advanced natural language understanding capabilities."
    },
    {
        "filename": "20230920_DBMS_Notes_CSE.txt",
        "summary": "• Complete guide to Database Management System concepts\n• Covers normalization, SQL queries, transaction management\n• Includes relational algebra and database design\n• Comprehensive indexing strategies",
        "category": "Notes",
        "department": "CSE",
        "year": 2023,
        "tags": ["database", "DBMS", "SQL", "normalization", "relational algebra"],
        "uploader": "admin@findly.com",
        "role": "admin",
        "branch": None,
        "semester": None,
        "timestamp": "2023-09-20T14:15:00",
        "text": "Database Management System Notes - Complete guide to DBMS concepts including normalization, SQL queries, transaction management, and indexing. Covers relational algebra and database design principles. Essential concepts for database administrators and developers."
    },
    {
        "filename": "20231201_ML_Research_Paper.txt",
        "summary": "• Survey on deep learning techniques for image classification\n• CNN architectures and transfer learning analysis\n• Model optimization strategies\n• Published research findings 2023",
        "category": "Research Paper",
        "department": "CSE",
        "year": 2023,
        "tags": ["machine learning", "deep learning", "CNN", "image classification", "transfer learning"],
        "uploader": "admin@findly.com",
        "role": "admin",
        "branch": None,
        "semester": None,
        "timestamp": "2023-12-01T09:45:00",
        "text": "Machine Learning Research Paper - Survey on deep learning techniques for image classification. Discusses CNN architectures, transfer learning, and model optimization. Published 2023. Comprehensive analysis of modern deep learning approaches."
    },
    {
        "filename": "20230815_WebDev_Project_Report.txt",
        "summary": "• Full stack web application development\n• Tech stack: React, Node.js, Express, MongoDB\n• Features: User authentication, REST API, responsive design\n• Final year project 2023",
        "category": "Project Report",
        "department": "CSE",
        "year": 2023,
        "tags": ["web development", "React", "Node.js", "MongoDB", "full stack", "REST API"],
        "uploader": "admin@findly.com",
        "role": "admin",
        "branch": None,
        "semester": None,
        "timestamp": "2023-08-15T16:20:00",
        "text": "Web Development Project - Full stack web application using React, Node.js, Express, and MongoDB. Features user authentication, REST API, and responsive design. Final year project 2023. Demonstrates modern web development practices."
    },
    {
        "filename": "20231010_Cloud_Computing_ECE.txt",
        "summary": "• Study on AWS services and cloud infrastructure\n• Containerization with Docker and Kubernetes\n• Serverless architecture implementation\n• Submitted by ECE department",
        "category": "Assignment",
        "department": "ECE",
        "year": 2023,
        "tags": ["cloud computing", "AWS", "Docker", "Kubernetes", "serverless"],
        "uploader": "admin@findly.com",
        "role": "admin",
        "branch": None,
        "semester": None,
        "timestamp": "2023-10-10T11:30:00",
        "text": "Cloud Computing Assignment - Study on AWS services, containerization with Docker, Kubernetes orchestration, and serverless architecture. Submitted by ECE department. Comprehensive overview of modern cloud technologies."
    }
]

# Read existing data
with open('data.json', 'r', encoding='utf-8') as f:
    existing_data = json.load(f)

# Add sample documents to existing data
existing_data.extend(sample_documents)

# Write back to file
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(existing_data, f, indent=2, ensure_ascii=False)

print(f"✅ Added {len(sample_documents)} sample documents to data.json")
print(f"Total documents now: {len(existing_data)}")
