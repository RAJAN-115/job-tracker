# Job Tracker Application

A full-stack job application tracking system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- 📝 Track job applications and their statuses
- 🔍 Search and filter job applications
- 📊 Dashboard with job application statistics
- 📱 Responsive design for mobile and desktop
- 🔐 Secure MongoDB Atlas database integration

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- CORS
- Dotenv for environment variables

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setup Instructions

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd job-tracker
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env    # Create your .env file
# Update .env with your MongoDB URI and other configurations
npm start
```

3. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

4. **Environment Variables**

Backend `.env` file should contain:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Project Structure

```
job-tracker/
├── frontend/           # React frontend
│   ├── src/           # Source files
│   ├── public/        # Public assets
│   └── package.json   # Frontend dependencies
├── backend/
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── server.js      # Server configuration
│   └── .env           # Backend environment variables
└── README.md          # Project documentation
```

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
