# Recruitment Management System

A React TypeScript SPA for managing job positions, applications, and candidates.

## Features

### 🎯 Three Major Modules
1. **Positions Page** - View and search job positions
2. **Apply Page** - Submit applications for positions  
3. **Position Detail Page** - View position details and manage candidates in tabbed interface

### 🛠 Tech Stack
- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with React-Redux
- **Routing**: React Router v6 for SPA navigation
- **Styling**: SCSS modules for component-scoped styles
- **Database**: IndexedDB with Dexie.js for client-side storage
- **Mock APIs**: Async functions with randomized response times (200-800ms)

### 📦 Key Features
- **Redux State Management**: Centralized state management with Redux Toolkit
- **Persistent Storage**: Data stored in browser's IndexedDB
- **Data Reset Option**: Reset browser data button in navbar with confirmation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Application status updates reflect across components
- **Tabbed Interface**: Candidates organized by status (pending, reviewed, shortlisted, etc.)
- **Search & Filter**: Find positions and filter candidates by status
- **Form Validation**: Complete form validation for applications
- **Mock Network Delays**: Realistic API response times

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **View Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Initial Data
The application automatically seeds IndexedDB with comprehensive sample data on first run:
- **30 job positions** across 20 companies and 12 departments (with random posting dates from the last 2 months)
- **1000+ candidates** with realistic profiles and diverse backgrounds
- **1500+ applications** distributed across positions with realistic status distribution
- **Realistic data patterns** including varied experience levels, skills, and application timelines

## Application Structure

### Pages
- **`/`** - Redirects to positions list
- **`/positions`** - List all job positions
- **`/position/:id`** - View individual position details with candidate management tabs
- **`/apply/:id`** - Apply to a specific position

### Data Models
- **Position**: Job postings with requirements, company info, status
- **Application**: Candidate applications with personal info, resume, skills
- **Candidate**: Applicant profiles with contact info and applications

### Mock API Features
- **Randomized Delays**: 200-800ms response times
- **Console Logging**: All API calls logged with payload and response data
- **CRUD Operations**: Full create, read, update, delete support
- **Search & Filter**: Position search and candidate filtering

### Sample Data Characteristics
- **Companies**: 20 diverse tech companies across different domains
- **Locations**: 18 locations including remote and hybrid options
- **Job Types**: Full-time, part-time, contract, and internship positions
- **Skills**: 47+ different technical skills realistically distributed
- **Application Status Distribution**:
  - 40% Pending applications
  - 25% Reviewed applications
  - 15% Shortlisted candidates
  - 15% Rejected applications
  - 5% Hired candidates
- **Experience Levels**: 1-15 years of experience across candidates
- **Realistic Patterns**: Candidates apply to 1-3 positions each, creating natural overlap

## Usage

### For Job Seekers
1. Browse available positions on the main page
2. Click "View Details" to see full job description
3. Click "Apply Now" to submit an application
4. Fill out the application form with your details

### For Recruiters
1. View all positions and their details
2. On position detail pages, see candidates organized in tabs by status
3. Update application status (pending → reviewed → shortlisted/rejected → hired)
4. Filter and sort candidates by various criteria within each tab

### Data Management
- **Reset Data**: Click the "Reset Data" button in the navigation bar to clear all browser data
- **Confirmation**: A modal will appear asking for confirmation before resetting
- **Fresh Start**: After reset, the application will reload with fresh sample data
- **Use Cases**: Useful for testing, demos, or starting with clean data

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components for routing
├── services/           # API services and database logic
├── store/              # Redux store, slices, and hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build production bundle
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Debugging
- **API Logging**: Open browser console to view detailed logs of all API calls
- **Payload Tracking**: See request parameters and response data for each operation
- **Performance Monitoring**: Response times are logged for each API call

### Performance Notes
- **Large Dataset**: With 1000+ candidates and 1500+ applications, the app demonstrates performance with realistic data volumes
- **IndexedDB Efficiency**: Database operations remain fast even with large datasets
- **Redux Optimization**: State management handles large collections efficiently
- **UI Pagination**: Consider implementing pagination for very large candidate lists in production

### Common Issues
- **Infinite Loops**: Avoid including Redux state objects in useEffect dependencies when fetching data. Instead, only include primitive values like `id` and `dispatch`.

**Example Console Output:**
```
🚀 API Call: positionApi.getAllPositions
⏰ Timestamp: 2024-01-15T10:30:45.123Z
📥 Response: [{ id: '1', title: 'Senior Developer', ... }]

🚀 API Call: applicationApi.createApplication
⏰ Timestamp: 2024-01-15T10:31:12.456Z
📤 Payload: { positionId: '1', candidateName: 'John Doe', ... }
📥 Response: { id: 'app123', status: 'pending', ... }
```

## Future Enhancements
- User authentication & authorization
- File upload for resumes
- Email notifications
- Advanced search filters
- Export functionality
- Interview scheduling

---

Built with ❤️ using React, TypeScript, and modern web technologies.
