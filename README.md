# AcadeX Student Management System

A web-based academic management platform featuring student record management, GPA tracking, and a professor-student feedback system with real-time updates.

---

## Features

### Professor Panel
- **Add Student** — Register new students into the system
- **View Students** — Browse and manage all student records
- **Update Student** — Edit existing student information
- **Search Student** — Look up students by ID or name
- **Sort Students** — Sort records by name or GPA
- **Reply to Feedback** — Respond to feedback submitted by students
- **View All Feedback** — See all submitted feedback in one place

### Student Panel
- **View GPA** — Check current GPA and academic standing
- **Submit Feedback** — Send messages or concerns to the professor
- **My Feedback** — View personal feedback history and professor replies

---

## Tech Stack

- **HTML** — Structure and layout
- **CSS** — Styling and responsive design
- **JavaScript** — Logic, DOM manipulation, and localStorage persistence

---

## Getting Started

Since AcadeX is a pure front-end application, no installation or server setup is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/acadex.git
   ```
2. Open `index.html` in your browser.

That's it — no dependencies, no build tools.

---

## Project Structure

```
acadex/
├── index.html       # Main HTML structure and all screens
├── style.css        # Styling and theme variables
├── app.js           # Navigation and utility functions
├── students.js      # Student CRUD operations and GPA logic
└── feedback.js      # Feedback submission and reply system
```

---

## Data Persistence

AcadeX uses the browser's **localStorage** to persist student records and feedback across sessions. No backend or database is required.
