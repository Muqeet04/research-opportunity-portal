# University Research Opportunity Portal

A full-stack web application for managing university research opportunities. Built with **Node.js + Express** backend, **MySQL** database, and a **Bootstrap 5** single-page frontend.

**Assignment:** CN — BS(CS 5A) — Assignment #01

---

## Features

- **CRUD Operations** — Create, Read, Update, and Delete research opportunities
- **Status Toggle** — Flip opportunities between Open and Closed
- **Validation** — Server-side validation with clear error messages
- **Responsive UI** — Clean Bootstrap 5 interface with toasts, modals, and cards
- **RESTful API** — 5 well-structured endpoints with proper HTTP status codes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MySQL 8 |
| Frontend | HTML + CSS + Bootstrap 5 + Vanilla JavaScript |
| API Testing | Postman |

---

## Prerequisites

- **Node.js** v18+ and npm
- **MySQL** 8.x

---

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/Muqeet04/research-opportunity-portal.git
cd research-opportunity-portal
```

### 2. Set up the database

```bash
# Log into MySQL and run the schema
mysql -u your_user -p < database/schema.sql

# (Optional) Load sample data
mysql -u your_user -p research_portal < database/seed.sql
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
```

`.env` file:
```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=research_portal
PORT=3000
```

### 4. Install dependencies and start

```bash
cd backend
npm install
npm start
```

### 5. Open in browser

Navigate to **http://localhost:3000** — the frontend is served automatically by Express.

---

## API Endpoints

| Method | Endpoint | Purpose | Success | Error |
|---|---|---|---|---|
| POST | `/api/opportunities` | Create opportunity | 201 | 400 |
| GET | `/api/opportunities` | List all opportunities | 200 | 500 |
| GET | `/api/opportunities/:id` | Get one opportunity | 200 | 404 |
| PUT | `/api/opportunities/:id` | Update opportunity | 200 | 400, 404 |
| DELETE | `/api/opportunities/:id` | Delete opportunity | 200 | 404 |

### Validation Rules

- **Required fields:** `title`, `research_area`, `faculty_name`, `department`, `application_deadline`
- **`available_positions`:** must be a non-negative integer
- **`status`:** must be `"Open"` or `"Closed"`

### Example: Create Opportunity

```bash
curl -X POST http://localhost:3000/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI in Healthcare",
    "description": "Researching AI applications in medical diagnosis",
    "research_area": "Artificial Intelligence",
    "faculty_name": "Dr. Smith",
    "department": "Computer Science",
    "required_skills": "Python, Machine Learning",
    "available_positions": 3,
    "application_deadline": "2027-06-30"
  }'
```

---

## Project Structure

```
research-opportunity-portal/
├── backend/
│   ├── config/db.js                 ← MySQL connection pool
│   ├── controllers/                 ← Validation & business logic
│   ├── models/                      ← SQL query functions
│   ├── routes/                      ← Express route definitions
│   ├── app.js                       ← Express app setup
│   ├── server.js                    ← Entry point
│   └── .env.example                 ← Environment template
├── frontend/
│   ├── index.html                   ← Single-page application
│   ├── css/style.css                ← Custom styles
│   └── js/app.js                    ← Fetch API logic
├── database/
│   ├── schema.sql                   ← Database & table DDL
│   └── seed.sql                     ← Sample data
├── postman/
│   └── research-portal.postman_collection.json
├── README.md
└── .gitignore
```

---

## GitHub Repository

🔗 **https://github.com/Muqeet04/research-opportunity-portal**

---

## License

This project is for academic purposes (CN Assignment #01).
