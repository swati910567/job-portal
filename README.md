

## Overview
This is a **Job Portal API** that provides job listings with filtering options. It includes job scraping functionality and RESTful API endpoints.

## Features
- Fetch job listings with filters
- Get job details by ID
- Trigger job scraping manually
- Secure backend with CORS configuration
- Database integration using MongoDB

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Scraping Service:** Custom job scraper
- **Authentication:** Passport.js (if applicable)
- **Deployment:** Render (Backend), Netlify (Frontend)

---
## Installation & Setup
### 1. Clone the Repository
```sh
git clone https://github.com/your-username/job-portal-api.git
cd job-portal-api
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### 4. Start the Server
```sh
npm run dev  # Runs with nodemon
```

The server will start on `http://localhost:5000`

---
## API Endpoints

### **Jobs API**
| Method | Endpoint        | Description              |
|--------|---------------|--------------------------|
| GET    | `/api/jobs`     | Fetch all jobs          |
| GET    | `/api/jobs/:id` | Get job details by ID   |
| POST   | `/api/jobs/scrape` | Manually trigger job scraping |

#### Example Request:
```sh
GET /api/jobs?page=1&limit=10
```

#### Example Response:
```json
[
  {
    "_id": "660b12fba4c3",
    "title": "Software Engineer",
    "company": "TechCorp",
    "location": "Remote",
    "postedAt": "2025-03-10T08:00:00.000Z"
  }
]
```

---
## Deployment
The API is deployed on Render:  
https://job-portal-dg03.onrender.com/api/jobs

Frontend is hosted on Netlify:  
https://curious-horse-3cf48a.netlify.app

---
## Contribution Guidelines
1. Fork the repository.
2. Create a new branch (`feature-branch` or `fix-branch`).
3. Commit and push your changes.
4. Submit a Pull Request (PR).



