# TaskPulse: Full-Stack Task Manager with Authentication (Day 20 Capstone)

A production-grade, responsive full-stack task management web application built from scratch for the **Day 20 Capstone Project**. TaskPulse features secure multi-user JWT authentication, user-isolated task CRUD operations, category management, due-date tracking with relative status indicators, real-time analytics, and an ultra-modern responsive dashboard with dark/light mode.

---

## 🔗 Live Deployment & Repository Links

- 🌐 **Live Frontend Application (Netlify)**: [https://remarkable-lokum-8ade49.netlify.app](https://remarkable-lokum-8ade49.netlify.app)
- ⚙️ **Live Backend API (Render)**: [https://taskpulse-backend-5fmd.onrender.com](https://taskpulse-backend-5fmd.onrender.com)
- 📡 **API Health Check**: [https://taskpulse-backend-5fmd.onrender.com/api/health](https://taskpulse-backend-5fmd.onrender.com/api/health)
- 📂 **GitHub Backend Repository**: [https://github.com/bhaumik-1910/taskpulse-backend](https://github.com/bhaumik-1910/taskpulse-backend)
- 🎥 **Project Walkthrough Video (Google Drive)**: [Watch Demo Video](https://drive.google.com/file/d/1ncNq6fv_v91h_SOzho5lk5p7cUC_ntR9/view?usp=sharing)

---

## 🌟 Key Features

1. **Multi-User Authentication & Security**
   - User registration and login using JSON Web Tokens (JWT) and `bcryptjs` password hashing (10 salt rounds).
   - Protected API endpoints using custom Bearer token middleware (`auth.js`).
   - Strict data isolation: Users can **only** access, edit, or delete their own tasks. Cross-user data access is blocked at the database level.
   - Stored XSS defense: All user-supplied text (titles, descriptions, categories) is sanitized using `escapeHtml()` before rendering.

2. **Full CRUD Task Management**
   - **Create**: Add new tasks with title, description, category, priority, and due date.
   - **Read**: View tasks in a clean list/grid with status badges, category tags, and due date countdowns.
   - **Update**: Edit existing tasks via an accessible modal dialog.
   - **Complete / Toggle**: One-click checkbox with optimistic UI updates and instant strikethrough animation.
   - **Delete**: Remove tasks with verification.

3. **Dashboard Analytics & Real-Time Metrics**
   - **Total Tasks**: Total count across all categories.
   - **Completed Tasks**: Count with dynamic percentage progress bar.
   - **In Progress (Pending)**: Active tasks requiring attention.
   - **Overdue Tasks**: Automatically flagged if the due date has passed.

4. **Categorization, Filtering & Search**
   - **Categories**: 💼 Work, 🏠 Personal, 📚 Study, ❤️ Health, 💰 Finance, 🏷️ Other.
   - **Priority Levels**: 🔥 High (Crimson glow), ⚡ Medium (Amber), 🌱 Low (Slate).
   - **Due Date Indicators**: Highlighted badges for *Overdue*, *Due Today*, *Tomorrow*, and *Upcoming*.
   - **Status Tabs**: Filter by *All*, *Active*, or *Completed*.
   - **Instant Search**: Debounced search across task titles and descriptions.
   - **Multi-criteria Sorting**: Sort by Due Date (Earliest / Latest), Newest First, Priority (High to Low), or Title (A to Z).

5. **Aesthetics & Performance**
   - Modern glassmorphism UI with Google Fonts (`Plus Jakarta Sans`).
   - Dark / Light mode toggle with smooth transitions and `localStorage` persistence.
   - Built with zero-framework Vanilla JS & CSS for lightweight, lightning-fast rendering.
   - Built-in one-click demo credentials loader (`demo@taskpulse.app` / `demo123456`) for rapid grading and demonstration.

---

## 📁 Project Architecture

```
Assignment-5/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB Mongoose connection
│   ├── middleware/
│   │   └── auth.js            # JWT Bearer token verification middleware
│   ├── models/
│   │   ├── User.js            # User Schema (name, unique email, hashed password)
│   │   └── Task.js            # Task Schema (title, description, category, priority, dueDate, completed, user ref)
│   ├── routes/
│   │   ├── authRoutes.js      # /auth/signup, /auth/login
│   │   └── taskRoutes.js      # /tasks (CRUD, /stats, /toggle)
│   ├── .env.example           # Template for environment variables
│   ├── .env                   # Local configuration (PORT, MONGODB_URI, JWT_SECRET)
│   ├── package.json           # Node dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
│   ├── seed-demo.js           # Seeds demo user & realistic tasks for instant presentation
│   ├── test-api.js            # Automated integration test script for all endpoints
│   └── server.js              # Express app entrypoint & health check endpoint
├── frontend/
│   ├── index.html             # Landing & authentication page (Sign In / Register / Demo prefill)
│   ├── dashboard.html         # Rich interactive Task Manager dashboard
│   ├── style.css              # Custom design system, tokens, glassmorphism, responsive styles
│   ├── auth.js                # Auth client logic & session management
│   ├── dashboard.js           # Dashboard controller (CRUD, optimistic UI, search, filtering, theme)
│   ├── utils.js               # Helper utilities (escapeHtml XSS defense, formatDueDate, showToast)
│   ├── config.js              # Environment-aware API base configuration
│   └── serve.js               # Zero-dependency local static server
└── README.md                  # Complete documentation & presentation guide
```

---

## 🔌 API Routes Specification

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check ping for Render deployment monitoring |
| `POST` | `/auth/signup` | No | Register a new user (`name`, `email`, `password`) |
| `POST` | `/auth/login` | No | Authenticate user and return JWT token |
| `GET` | `/tasks` | **Yes** | Fetch all tasks for logged-in user with filters (`category`, `status`, `search`, `sortBy`) |
| `GET` | `/tasks/stats` | **Yes** | Compute analytics summary (`total`, `completed`, `pending`, `overdue`, `completionRate`) |
| `GET` | `/tasks/:id` | **Yes** | Get a specific task (ownership verified) |
| `POST` | `/tasks` | **Yes** | Create a new task tied to `req.user.id` |
| `PUT` | `/tasks/:id` | **Yes** | Update task fields (ownership verified) |
| `PATCH` | `/tasks/:id/toggle` | **Yes** | Quick-toggle task completion status (ownership verified) |
| `DELETE` | `/tasks/:id` | **Yes** | Delete task (ownership verified) |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or newer)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Start Backend
```bash
cd backend
npm install
node seed-demo.js   # (Optional) Seeds sample tasks and demo evaluator account
node server.js
```
The backend will run on `http://localhost:3000`.

### 2. Start Frontend
In a separate terminal:
```bash
cd frontend
node serve.js
```
The frontend static server will run on `http://localhost:5500`.

### 3. Open in Browser
Visit `http://localhost:5500`:
- Click **"Prefill Demo"** and **"Sign In"** to instantly test with realistic demo tasks.
- Or click **"Create Account"** to test multi-user isolation with your own credentials.

---

## 🧪 Automated Testing

Run the automated test suite to verify user isolation and all CRUD operations:
```bash
cd backend
node test-api.js
```
Expected output:
```
=== Testing Task Manager API ===
1. Health Check: 200 ok
2. Signup User 1: 201 User created successfully
3. Login User 1: 200 Token received: true
4. Create Task 1: 201 Build Capstone Dashboard UI
4. Create Task 2: 201 Study Mongoose Aggregations
5. Toggle Task 1 Completed: 200 true
6. User 1 Stats: 200 { total: 2, completed: 1, pending: 1, completionRate: 50 }
7. User 2 Tasks Count (Isolation): 0
8. User 2 unauthorized delete attempt (404 expected): 404
=== All Backend API Tests Passed Successfully! ===
```

---

## 🌐 Deployment Instructions (Section 5)

### Backend Deployment (Render + MongoDB Atlas)
1. Push the `backend/` directory to a GitHub repository:
   ```bash
   cd backend
   git init && git add . && git commit -m "Initial commit - TaskPulse Backend"
   git remote add origin https://github.com/<your-username>/taskpulse-backend.git
   git branch -M main && git push -u origin main
   ```
2. In [Render](https://render.com), create a **New Web Service**:
   - Connect the repository.
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add Environment Variables:
     - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
     - `JWT_SECRET`: `<Your Production Secret Key>`
     - `PORT`: `3000`
3. Note your live Render URL: e.g. `https://taskpulse-backend.onrender.com`.

### Frontend Deployment (Netlify)
1. Update `frontend/config.js` with your deployed Render URL:
   ```javascript
   const API_BASE =
       location.hostname === "localhost" || location.hostname === "127.0.0.1"
           ? "http://localhost:3000"
           : "https://taskpulse-backend.onrender.com";
   ```
2. Push `frontend/` to GitHub or drag-and-drop the `frontend` folder into [Netlify](https://www.netlify.com):
   - Publish directory: `/` (or root of frontend).
   - No build command required.
3. Your frontend will be live on Netlify!

---

## 🎯 Presentation Guidelines Checklist (Section 4)

Use this checklist during your Capstone presentation:
- [x] **Live Demo Links Ready**: Netlify Frontend URL + Render Backend URL.
- [x] **Live Walkthrough**:
  - Show the landing page with tab-based Sign In / Sign Up.
  - Sign in and showcase the real-time metrics cards (Total, Completed, Pending, Overdue).
  - Create a new task with high priority, category, and due date.
  - Toggle completion and showcase the instant optimistic UI update and progress bar adjustment.
  - Filter tasks by category pills (Work, Study, Health) and status tabs (Active, Completed).
  - Search tasks using the live search bar.
  - Toggle dark and light theme.
  - Log out and demonstrate route protection (dashboard cannot be accessed without token).
- [x] **Show GitHub Repositories**: Clean commit history and documentation.
- [x] **Challenge Faced & Solution**:
  - *Challenge*: Real-time UI responsiveness when toggling completion on slow networks.
  - *Solution*: Implemented optimistic UI updates in `dashboard.js` with automatic rollback on network failure.
  - *Challenge*: Stored XSS prevention across user titles and descriptions.
  - *Solution*: Centralized `escapeHtml()` utility to sanitize all rendered content before inserting into the DOM.
- [x] **Future Improvements**:
  - Subtasks / checklists inside each task card.
  - Due date email or push notifications.
  - Drag-and-drop Kanban view.

---

## 📹 Video Walkthrough Guide (Final Submission)

▶️ **Recorded Demo Video Link**: [Watch on Google Drive](https://drive.google.com/file/d/1ncNq6fv_v91h_SOzho5lk5p7cUC_ntR9/view?usp=sharing)

For the final submission:
1. Open Screen Recorder (OBS or Loom).
2. Follow the 2–3 minute script:
   - **0:00 - 0:30**: Introduction, tech stack (Node.js, Express, MongoDB, Vanilla JS, CSS Glassmorphism), and multi-user concept.
   - **0:30 - 1:15**: Registration/Login and authentication flow.
   - **1:15 - 2:00**: Adding tasks, filtering by category, search, priority tags, and due date indicators.
   - **2:00 - 2:30**: Marking tasks completed, progress bar animation, edit modal, and theme toggle.
   - **2:30 - 3:00**: Code structure walkthrough and deployment summary.
3. Upload video to Google Drive or GitHub repo release.

