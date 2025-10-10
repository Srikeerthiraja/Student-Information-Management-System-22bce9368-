<h1 align="center">
   Student Information Management System
</h1>

<h3 align="center">
<pre>Effortlessly manage student data and academic operations — from organizing classes and enrolling students or faculty, to tracking attendance, evaluating performance, and delivering feedback. Access academic records, view grades, and communicate with ease — all in one seamless platform.</pre>
</h3>

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
