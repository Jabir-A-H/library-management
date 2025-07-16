# Project Documentation: ছোটপাতা পাঠাগার (Chotopata Pathagar)

---

## Overview

A modern, full-stack library management system built with FastAPI (Python) and Next.js (React/TypeScript). Features include JWT authentication, async operations, book/borrower/lending management, and a clean separation of frontend and backend.

---

## Table of Contents
- [Project Documentation: ছোটপাতা পাঠাগার (Chotopata Pathagar)](#project-documentation-ছোটপাতা-পাঠাগার-chotopata-pathagar)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Setup Guide](#setup-guide)
  - [Migration Plan](#migration-plan)
  - [API Overview](#api-overview)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

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

## Project Structure
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

## Setup Guide
See [`SETUP_GUIDE.md`](SETUP_GUIDE.md) for step-by-step instructions on installing dependencies, configuring environments, and running the project locally.

---

## Migration Plan
See [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md) for a detailed plan to migrate, refactor, and improve the codebase. Includes type definition fixes, API layer repair, and React Query improvements.

---

## API Overview
- **Backend:** FastAPI routes in `backend/src/routes/`
- **Schemas:** Pydantic models in `backend/src/schemas/`
- **Frontend:** API calls in `frontend/lib/api.ts`
- **Types:** Shared TypeScript types in `frontend/types/`
- **Authentication:** JWT-based, with protected endpoints and role-based access

---

## Testing
- **Frontend:** Use Jest and React Testing Library for unit/integration tests
- **Backend:** Use Pytest for API and model tests
- **CI/CD:** Recommended to set up GitHub Actions for automated testing

---

## Contributing
- Follow code style guides (ESLint, Prettier, Black)
- Write clear commit messages
- Add/maintain documentation for new features
- Review and update tests for all changes

---

## License
MIT License

---

**For more details, see individual documentation files in the project root.**
