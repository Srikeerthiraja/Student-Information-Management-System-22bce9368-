<h1 align="center">
   Student Information Management System
</h1>

<h3 align="center">
<pre>A MERN-based Student Information Management System implementing role-based access (Admin, Teacher, Student) with JWT authentication. The system supports attendance tracking, performance evaluation, and secure REST APIs.</pre>
</h3>

# About

The Student Information Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline class organization and facilitate communication between students, teachers, and administrators.

## Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Attendance Tracking:** Implemented attendance management using REST APIs with MongoDB schemas linked to classes and students.

- **Performance Assessment:** Teachers can assess students' performance by providing marks and feedback. Students can view their marks and track their progress over time.

- **Data Visualization:** Students can visualize their performance data through interactive charts and tables, helping them understand their academic performance at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

## Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB
- Containerization: Docker, Docker Compose (local development)
- Authentication & Security: JWT-based role authentication

<br>

## Architecture Overview
- React frontend communicates with Express REST APIs using the Fetch API
- JWT tokens are used for authentication and role-based authorization
- MongoDB stores users, classes, attendance, and performance data

## Installation

Open 2 terminals in separate windows/tabs.

Terminal 1: Setting Up Backend 
```sh
cd backend
npm install
npm start
```

Create a file called .env in the backend folder.
Inside it write this :

```sh
MONGO_URL = mongodb://localhost:27017/Student_Record
```
If you are using MongoDB Compass you can use this database link but if you are using MongoDB Atlas then instead of this link write your own database link.

Terminal 2: Setting Up Frontend
```sh
cd frontend
npm install
npm start
```
Now, navigate to `localhost:3000` in your browser. 
The Backend API will be running at `localhost:5000`.

You can run the project locally using **Docker** for a fully containerized environment.

1. **Clone the repository**:

```sh
git clone <your-repo-link>
cd MERN-Student-Information-Management-System
```

## Project Structure

```
.
├── backend/                  # Node.js + Express API
│   ├── Dockerfile            # Backend Dockerfile
│   └── ...                   # Server files
├── frontend/                 # React.js frontend
│   ├── Dockerfile            # Frontend Dockerfile
│   └── ...                   # Client files
├── docker-compose.yml        # Used for local multi-container orchestration
└── .env                      # Environment variables (e.g., MONGODB_URI)
```


