# Doctor Appointment Booking Portal

Full-stack doctor appointment portal using Django REST on the backend and React 18 + Tailwind on the frontend.

## Stack

- Backend: Django, Django REST Framework, Simple JWT, SQLite or any SQL DB via `DATABASE_URL`
- Frontend: React 18, Vite, Tailwind CSS, Redux Toolkit, Axios, React Router, Framer Motion, React Hot Toast
- Uploads: Cloudinary
- Payments: Razorpay
- Email: Django SMTP

## Project Structure

```text
client/
server/
```

## Backend Setup

1. Create a virtual environment.
2. Install dependencies:

```bash
cd server
pip install -r requirements.txt
```

3. Create `.env` from `.env.example`.
4. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start the backend:

```bash
python manage.py runserver
```

The seeded admin is created automatically after migrations using:

- Email: `admin@docportal.com`
- Password: `Admin@123`

## Frontend Setup

1. Install dependencies:

```bash
cd client
npm install
```

2. Create `.env` from `.env.example`.
3. Start the frontend:

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
- For production, set HTTPS and tighten cookie/security settings in `server/core/settings.py` and `server/apps/accounts/views.py`.
- Razorpay and Cloudinary require valid credentials in `server/.env`.
