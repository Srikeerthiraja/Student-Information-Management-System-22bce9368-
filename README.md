<h1 align="center">
   Student Information Management System
</h1>

<h3 align="center">
<pre>Effortlessly manage student data and academic operations — from organizing classes and enrolling students or faculty, to tracking attendance, evaluating performance, and delivering feedback. Access academic records, view grades, and communicate with ease — all in one seamless platform.</pre>
</h3>

# About

The Student Information Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline class organization and facilitate communication between students, teachers, and administrators.

## Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Attendance Tracking:** Teachers can easily take attendance for their classes, mark students as present or absent, and generate attendance reports.

- **Performance Assessment:** Teachers can assess students' performance by providing marks and feedback. Students can view their marks and track their progress over time.

- **Data Visualization:** Students can visualize their performance data through interactive charts and tables, helping them understand their academic performance at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

## Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB

<br>

# Installation

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

# About

The Student Information Management System is a web-based application built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. It streamlines class organization, facilitates communication between students, teachers, and administrators, and ensures secure role-based access for all users.

# Features

- **User Roles:** Admin, Teacher, and Student, each with role-specific access and functionalities.
- **Admin Dashboard:** Manage users, create classes and subjects, and configure system settings.
- **Attendance Tracking:** Take attendance, mark students present/absent, and generate reports.
- **Performance Assessment:** Teachers provide marks and feedback; students track progress.
- **Data Visualization:** Interactive charts and tables for performance insights.
- **Communication:** Messaging system between students and teachers for effective collaboration.

# Technologies Used

- **Frontend:** React.js, Material UI, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization & Deployment:** Docker, Docker Compose, Heroku
- **Authentication & Security:** JWT-based role authentication

# Installation & Running Locally

You can run the project locally using **Docker** for a fully containerized environment.

1. **Clone the repository**:

```sh
git clone <your-repo-link>
cd MERN-Student-Information-Management-System
```

# Heroku Deployment Guide (MERN Stack with Docker)

##  Deployment Steps

| Step | Description |
| :--- | :--- |
| **1. Container Files** | Ensure `Dockerfile`s (one for backend, one for frontend) are present in their respective directories. |
| **2. Database Connection** | Configure `MONGODB_URI` or similar variable in the backend's `.env` file to connect to your **MongoDB Atlas** database. |
| **3. Git Repository** | Push all current code, including all Docker files and the `docker-compose.yml`, to your **GitHub** repository. |
| **4. Heroku Setup** | Connect the Heroku app to your GitHub repository and select the **Container Registry** deployment option. |
| **5. Build & Run** | Heroku automatically executes the Docker build process based on your Dockerfiles and runs the resulting container images. |
| **6. Access** | Your application becomes live and accessible via the assigned **Heroku URL**. |

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

##  License

```
This project is licensed under the MIT License.
```

