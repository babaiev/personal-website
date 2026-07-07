# Personal Website

A responsive, full-stack personal website featuring a Landing Page, an AI Newsfeed, and a Blog.

## Architecture

This project uses a modern decoupled architecture:
- **Backend**: A Django REST Framework API that handles data logic, models, and endpoints for the portfolio, blog, and newsfeed.
- **Frontend**: A React Single Page Application (SPA) built with Vite for lightning-fast development, featuring custom premium CSS with glassmorphism and modern styling.

## Prerequisites

Make sure you have the following installed on your machine:
- **Python 3.12+**
- **Node.js 20+**

## Local Setup

### 1. Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (created at the root of the project):
   ```bash
   source ../venv/bin/activate
   ```
3. Run the development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will be available at `http://127.0.0.1:8000`.

### 2. Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend UI will be available at `http://localhost:5173`.

## Testing

This project includes automated unit tests for both the frontend and backend to ensure reliability.

- **Backend Tests**:
  ```bash
  cd backend
  source ../venv/bin/activate
  python manage.py test
  ```

- **Frontend Tests**:
  ```bash
  cd frontend
  npm run test
  ```
  *(Note: This uses Vitest and React Testing Library).*

## CI/CD Pipeline

The repository is configured with a **GitHub Actions** workflow (`.github/workflows/ci-cd.yml`). It automatically runs on every push and pull request to the `main` branch. 

The pipeline spins up two parallel jobs:
1. Installs Python dependencies and runs the Django test suite.
2. Installs Node dependencies and runs the React Vitest suite.

If both test suites pass, it proceeds to the deployment step (which can be hooked up to providers like Render, Vercel, or Heroku).
