# Job Application Tracker

A full-stack job application tracking system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Live Demo

- Frontend: [https://job-tracker-dusky.vercel.app](https://job-tracker-dusky.vercel.app)
- Backend API: [https://job-tracker-backend-fp1h.onrender.com](https://job-tracker-backend-fp1h.onrender.com)

## Important Note for Recruiters

This application uses a free-tier backend service that may go to sleep after periods of inactivity. If you encounter issues:

1. Please wait 30-60 seconds for the backend to wake up
2. Refresh the page after the backend is active
3. If problems persist, you can run the application locally using the instructions below

## Features

- 📝 Track job applications and their statuses
- 🔍 Search and filter job applications
- 📊 Dashboard with job application statistics
- 📱 Responsive design for mobile and desktop
- 🔐 Secure MongoDB Atlas database integration

## Tech Stack

### Frontend

- React with Vite
- Material-UI components
- Axios for API calls
- Responsive design with MUI

### Backend

- Node.js with Express
- MongoDB Atlas for database
- RESTful API architecture
- CORS enabled for security

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/RAJAN-115/job-tracker.git
cd job-tracker
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env    # Create your .env file
# Update .env with your MongoDB URI
npm start
```

3. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend (Render)

- Deployed at: https://job-tracker-backend-fp1h.onrender.com
- Auto-deploys from main branch
- Environment variables configured in Render dashboard

### Frontend (Vercel)

- Deployed at: https://job-tracker-dusky.vercel.app
- Auto-deploys from main branch
- Environment variables configured in Vercel dashboard

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication
- [ ] Job application statistics
- [ ] Email notifications
- [ ] Mobile app version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Rajan - [GitHub Profile](https://github.com/RAJAN-115)
