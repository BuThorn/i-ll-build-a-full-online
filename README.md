# Online Shop

A full-stack online shop starter with a React + Tailwind CSS frontend and a Django REST backend.

## Project Structure

```text
backend/     Django, Django REST Framework, JWT auth, catalog, carts, orders
frontend/    Vite, React, TypeScript, Tailwind CSS, product browsing and checkout UI
```

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/`.

## Frontend

Use `npm.cmd` on Windows PowerShell if `npm.ps1` is blocked by execution policy.

```powershell
cd frontend
npm.cmd install
copy .env.example .env
npm.cmd run dev
```

The frontend is available at `http://127.0.0.1:5173/`.

## Core Features

- Product catalog with categories, product detail pages, search, and sorting
- JWT registration/login flow
- Local cart with quantity controls
- Checkout flow that creates backend orders
- Admin-ready Django models for catalog and order management
- Environment-based settings and CORS configuration

