# Team Task Manager - Trello-Lite

A modern, full-stack task management application built with Next.js, Express.js, and MongoDB. Organize your projects, collaborate with your team, and track progress effortlessly with a beautiful Kanban board interface.

## 🚀 Features

### Core Functionality
- **Kanban Board**: Drag-and-drop task management with customizable columns
- **Project Management**: Create and organize multiple projects
- **Team Collaboration**: Invite team members and assign roles
- **Real-time Updates**: Live task updates and comments
- **File Attachments**: Upload and manage files for tasks
- **Dark/Light Theme**: Toggle between themes for better user experience

### User Management
- **Authentication**: Secure login/signup with JWT tokens
- **Role-based Access**: Admin, member, and viewer roles
- **User Profiles**: Manage user information and preferences

### Task Features
- **Task Creation**: Rich task creation with descriptions, due dates, and assignments
- **Task Comments**: Collaborative commenting system
- **File Attachments**: Attach files to tasks for better organization
- **Due Date Tracking**: Set and track task deadlines
- **Priority Levels**: Mark tasks with different priority levels

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **@hello-pangea/dnd** - Drag and drop functionality
- **Axios** - HTTP client
- **date-fns** - Date manipulation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Team_Task_Manager_-Trello-Lite-/
├── Backend/                 # Express.js API server
│   ├── controller/         # Route controllers
│   ├── lib/               # Database configuration
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── Frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # API utilities
│   │   │   ├── store/       # Redux store
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:4000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the Frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### File Upload
- `POST /api/upload` - Upload files

## 🎯 Usage

1. **Sign Up/Login**: Create an account or log in to access the application
2. **Create Projects**: Start by creating a new project
3. **Add Team Members**: Invite team members to collaborate
4. **Create Tasks**: Add tasks to your project's Kanban board
5. **Organize Workflow**: Drag and drop tasks between columns
6. **Collaborate**: Add comments and attachments to tasks
7. **Track Progress**: Monitor task completion and deadlines

## 🔧 Development

### Backend Development
```bash
cd Backend
npm run dev    # Start development server with nodemon
npm run lint   # Run ESLint
```

### Frontend Development
```bash
cd Frontend
npm run dev    # Start Next.js development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## 🚀 Deployment

### Backend Deployment
1. Set up your production environment variables
2. Build and deploy to your preferred hosting service (Heroku, Railway, etc.)
3. Ensure MongoDB connection is configured for production

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Trello's intuitive task management interface
- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Task Managing! 🎉**
