# Doctor Appointment Booking Portal

Full-stack doctor appointment portal using Django REST on the backend and React 18 + Tailwind on the frontend.

## Folders

- `frontend/` = Frontend (React + Vite)
- `backend/` = Backend (Django REST)

## Stack

- Backend: Django, Django REST Framework, Simple JWT, SQLite or any SQL DB via `DATABASE_URL`
- Frontend: React 18, Vite, Tailwind CSS, Redux Toolkit, Axios, React Router, Framer Motion, React Hot Toast
- Uploads: Cloudinary
- Payments: Razorpay
- Email: Django SMTP

## Project Structure

```text
frontend/
backend/
```

## Quick Run (No .env copy needed for local)

Open 2 terminals from project root:

Terminal 1 (Backend):

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Terminal 2 (Frontend):

```bash
cd frontend
npm install
npm run dev
```

URLs:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:3000`

## Backend Setup

1. Create a virtual environment.
2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

4. Start the backend:

```bash
python manage.py runserver
```

The seeded admin is created automatically after migrations using:

- Email: `admin@docportal.com`
- Password: `Admin@123`

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm run dev
```

## Main API Groups

- `api/auth`
- `api/doctors`
- `api/appointments`
- `api/reviews`
- `api/notifications`
- `api/admin`

## Notes

- Cookies are configured for local development right now with `SameSite=Lax` and `secure=False`.
- For production, set HTTPS and tighten cookie/security settings in `backend/core/settings.py` and `backend/apps/accounts/views.py`.
- Razorpay and Cloudinary require valid credentials in `backend/.env`.
