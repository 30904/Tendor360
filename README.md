# Tender360 - World-Class Tender Management System

A comprehensive, enterprise-grade tender management system built with the MERN stack (MongoDB, Express, React, Node.js) featuring AI-powered insights, role-based access control, and a modern Thermo Fisher-inspired design.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens, role-based access control
- **Dashboard**: KPI cards, charts, recent activity tracking
- **Tender Intelligence**: AI-powered matching, discovery feed, scoring
- **Document Management**: File upload, versioning, comment threads
- **Pricing & Simulation**: Line-item quotes, win probability analysis
- **Calendar & Tracking**: Deadline management, milestone tracking
- **Reporting & Analytics**: Win/loss trends, performance metrics
- **Mobile-Responsive**: Bootstrap 5 with modern UI/UX
- **Theme System**: Light/dark mode with CSS variables

## 🏗️ Architecture

```
tender360/
├── frontend/          # React + Vite + Bootstrap 5
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux Toolkit store
│   │   ├── services/      # API services
│   │   └── styles/        # SCSS styles
│   └── package.json
├── backend/           # Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/        # Database & constants
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth & validation
│   │   └── seed/          # Development data
│   └── package.json
└── package.json       # Root workspace config
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **Bootstrap 5** for UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **Google Inter** font family

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Helmet** for security

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd tender360
npm run install:all
```

### 2. Environment Setup

#### Backend
```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/tender360
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend
```bash
cd frontend
# No .env needed for development (uses Vite proxy)
```

### 3. Database Setup

```bash
cd backend
npm run seed:dev
```

This creates:
- User roles and permissions
- Admin user: `admin@tender360.com` / `Admin@123`
- Sample tenders, evaluations, and data

### 4. Start Development Servers

```bash
# From root directory
npm run dev

# Or separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## 🔑 Default Users

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | admin@tender360.com | Admin@123 | Full system access |
| **Manager** | manager@tender360.com | Manager@123 | Tender management |
| **Reviewer** | reviewer@tender360.com | Reviewer@123 | Evaluation & scoring |
| **Pricing** | pricing@tender360.com | Pricing@123 | Pricing & analysis |

## 📱 Available Pages

- **Dashboard**: Overview with KPIs and charts
- **Tender Intelligence**: Discovery and AI matching
- **Qualification & Evaluation**: Bid/no-bid decisions
- **Document Management**: File handling and versioning
- **Pricing & Simulation**: Quote building and analysis
- **Tender Calendar**: Deadline and event management
- **Post-Award Tracker**: Contract and milestone tracking
- **Reporting & Analytics**: Performance insights
- **Admin & Config**: System configuration (Admin only)

## 🔧 Development

### Backend Commands
```bash
cd backend
npm run dev          # Start with nodemon
npm start           # Production start
npm run seed:dev    # Seed development data
```

### Frontend Commands
```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Code Quality
```bash
# Frontend linting
cd frontend && npm run lint

# Backend (manual for now)
# Consider adding ESLint to backend
```

## 🗄️ Database Collections

All collections use **UPPERCASE, SINGULAR** naming with timestamps:

- `USER` - User accounts and profiles
- `ROLE` - Role definitions and permissions
- `TENDER` - Tender information and metadata
- `EVALUATION` - Scoring and decision matrices
- `DOCUMENT` - File metadata and comments
- `PRICING` - Cost and pricing data
- `CALENDAR` - Events and deadlines
- `CONTRACT` - Post-award contracts
- `REPORT` - Generated reports and analytics

## 🔐 Security Features

- **JWT Authentication**: Short-lived access tokens (15m)
- **Refresh Tokens**: HttpOnly cookies for secure renewal
- **Role-Based Access**: Granular permission system
- **Password Security**: bcrypt with 12 salt rounds
- **Rate Limiting**: Auth endpoint protection
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers and CSP

## 🎨 Theming

The system uses a **Thermo Fisher-inspired** color scheme:

- **Primary**: #4678be (Blue)
- **Secondary**: #2b3a4a (Dark Blue)
- **Accent**: #f5f7fb (Light Gray)
- **Success**: #1e9e6e (Green)
- **Warning**: #f5a524 (Orange)
- **Danger**: #e25555 (Red)

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve dist/ folder with your web server
```

### Environment Variables
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set strong JWT secrets
- Configure CORS origin for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Tender360** - Transforming tender management with AI-powered insights and modern technology.
