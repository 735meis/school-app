# Timely - School Scheduling App

A modern mobile web application built with React and Node.js to help school students access their course schedules and calendar information in a simple and effective way. Features a sleek dark mode design with glassmorphism and smooth animations.

## Features

### User Roles

1. **Admin**
   - Create and manage schools
   - Register staff and student accounts
   - Full system access

2. **Staff**
   - Edit calendar events
   - Create and manage bell schedules
   - Add courses for each grade

3. **Student**
   - View calendar and bell schedules
   - Assign period numbers to courses
   - View today's schedule on homepage

### Screens

- **Homepage**: Shows today's schedule and calendar events
- **Calendar**: Grid view with event management (staff can create/edit, students view only)
- **Bell Schedule**: Display and manage daily schedules with periods, breaks, and lunch
- **Register**: Admin-only page to register schools, staff, and students

## Project Structure

```
school-app/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Server entry point
│   └── seedData.js         # Database seeding script
│
└── web/                    # React web application
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # React components (screens)
    │   ├── config/         # API configuration
    │   ├── context/        # React context (Auth)
    │   ├── App.js          # App entry point
    │   └── index.js        # Root render
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/timely
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

5. Make sure MongoDB is running on your system

6. Seed the database with admin accounts:
```bash
npm run seed
```

This will create three admin accounts:
- Email: admin@timely.com, Password: admin123
- Email: admin2@timely.com, Password: admin123
- Email: superadmin@timely.com, Password: super123

7. Start the backend server:
```bash
npm run dev
```

The server will run on http://localhost:3000

## Web App Setup

1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. The API URL is configured in `src/config/api.js`:
   - Default: `http://localhost:3000/api`
   - Update if your backend runs on a different port

4. Start the development server:
```bash
npm start
```

5. Open your browser:
   - The app will automatically open at `http://localhost:3001`
   - Or manually navigate to `http://localhost:3001`

6. Login with admin credentials:
   - Email: `admin@timely.com`
   - Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Schools
- `POST /api/schools` - Create school (admin only)
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get school by ID

### Users
- `POST /api/users` - Create user (admin only)
- `GET /api/users` - Get all users (admin only)

### Calendar Events
- `POST /api/calendar` - Create event (staff only)
- `GET /api/calendar` - Get events
- `PUT /api/calendar/:id` - Update event (staff only)
- `DELETE /api/calendar/:id` - Delete event (staff only)

### Bell Schedules
- `POST /api/bell-schedules` - Create schedule (staff only)
- `GET /api/bell-schedules` - Get schedules
- `PUT /api/bell-schedules/:id` - Update schedule (staff only)
- `DELETE /api/bell-schedules/:id` - Delete schedule (staff only)

### Courses
- `POST /api/courses` - Create course
- `GET /api/courses` - Get courses
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

## Usage Guide

### For Admins

1. Login with admin credentials
2. Navigate to Register page
3. Create schools, staff, and student accounts

### For Staff

1. Login with staff credentials
2. Navigate to Calendar to create events:
   - Click on a date or use the "Add Event" button
   - Fill in event details
3. Navigate to Bell Schedule to create schedules:
   - Choose between Standard (recurring) or Override (specific dates)
   - Add time slots for periods, breaks, and lunch
   - Select applicable days/dates and grades

### For Students

1. Login with student credentials
2. View today's schedule and events on the homepage
3. Browse the calendar to see upcoming events
4. Check the bell schedule for the daily class schedule

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Web App Development
```bash
cd web
npm start  # Starts React development server with hot reload
```

## Testing with Seed Data

After running `npm run seed` in the backend, you can test the application with these accounts:

**Admin Account:**
- Email: admin@timely.com
- Password: admin123

Use this account to:
1. Create a test school
2. Create staff and student accounts
3. Verify all admin functionalities

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend (Web)
- React 18
- React Router for navigation
- Axios for API calls
- LocalStorage for token storage
- Modern CSS with CSS Variables
- Glassmorphism UI design
- Gradient animations

## Design Features

- **Modern Dark Mode** - Sleek dark theme with vibrant gradients
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Smooth Animations** - Fade-in, slide-in, and hover effects
- **Gradient Accents** - Purple to pink gradient themes
- **Responsive Design** - Works on desktop and mobile browsers
- **Custom Scrollbars** - Styled gradient scrollbars

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Protected API routes
- Secure token storage in LocalStorage

## Future Enhancements

- Push notifications for calendar events
- Course assignment for students
- Attendance tracking
- Grade reporting
- Parent portal
- Multi-language support
- Progressive Web App (PWA) support
- Calendar export (iCal format)

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check the connection string in `.env`

**Port Already in Use:**
- Change the PORT in `.env` to a different value

### Web App Issues

**API Connection Error:**
- Verify the API URL in `web/src/config/api.js`
- Ensure backend server is running on port 3000
- Check browser console for CORS errors

**React Build Issues:**
- Clear cache: `rm -rf node_modules && npm install`
- Delete build folder: `rm -rf build`
- Restart development server

## License

MIT

## Contributors

Built for educational purposes.
