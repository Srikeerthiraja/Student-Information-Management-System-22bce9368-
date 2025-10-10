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

Deployment to Heroku

Ensure your Dockerfiles are included for both frontend and backend.

Configure MongoDB Atlas connection in backend .env.

Push your code to GitHub.

Connect your repo to Heroku and enable container-based deployment.

Heroku automatically builds your Docker images and runs the app.

Your application will be available via the Heroku live URL, accessible anywhere.
