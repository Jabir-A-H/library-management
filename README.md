# ছোটপাতা পাঠাগার (Chotopata Pathagar)

> Modern, full-stack library management system built with FastAPI (Python) and Next.js (React/TypeScript).

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)

---

## Features
- Book CRUD, metadata, categories/tags, cover images, advanced search
- Borrower profiles, multilingual support, relationship tracking
- Lending workflow, due date management, overdue tracking
- JWT authentication, role-based access, protected routes
- Async operations, type safety, modern UI/UX

---

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Sonner, Lucide Icons
- **Backend:** FastAPI, Python, SQLAlchemy, Pydantic, Alembic
- **Database:** PostgreSQL
- **Testing:** Jest (frontend), Pytest (backend)
- **Other:** React Query, dotenv, ESLint, Prettier, Black, Docker

---

## Architecture
```
library-management/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── dependencies/
│   │   ├── utils/
│   │   ├── database_async.py
│   │   └── main_fastapi.py
│   ├── alembic/
│   └── requirements.txt
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   ├── types/
│   └── package.json
├── README.md
├── SETUP_GUIDE.md
├── MIGRATION_PLAN.md
├── PROJECT_DOCUMENTATION.md
└── ...
```

---

## Documentation
- [Setup Guide](SETUP_GUIDE.md)
- [Migration Plan](MIGRATION_PLAN.md)
- [Project Documentation](PROJECT_DOCUMENTATION.md)

---

## License
MIT License
