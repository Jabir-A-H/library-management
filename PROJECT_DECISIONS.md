# Project Decisions & Technical Roadmap

**Project:** ছোটপাতা পাঠাগার (Chotopata Pathagar) - Library Management System  
**Last Updated:** September 1, 2026  
**Status:** Architecture Finalized — Ready for V1 Implementation

---

## 1. Project Context & Scope

- **Target Audience:** Small-scale community / personal library system.
- **Catalog Scale:** Up to ~5,000 books.
- **User Base:** Small group (~5 users / administrators).
- **Domain Focus:** Bengali & English bilingual catalog with physical shelf location tracking.

---

## 2. Core Architecture Decisions

### **Primary Stack: Next.js (App Router) + Supabase + Vercel**

```
┌─────────────────────────────────────────────────────────┐
│               Next.js App Router (Vercel)               │
│      React Server Components + Server Actions (TS)      │
└────────────────────────────┬────────────────────────────┘
                             │ Direct Type-Safe Queries
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase (BaaS)                     │
│  ├── PostgreSQL Database (Master Catalog & Relations)   │
│  ├── Supabase Auth (Admin & User Authentication)        │
│  ├── Row Level Security (RLS - User Isolation)          │
│  └── Supabase Storage (Book Cover Image CDN)            │
└─────────────────────────────────────────────────────────┘
```

### **Backend Decision: Retiring Dedicated Python (FastAPI) Server**
- **Decision:** A separate heavy Python (FastAPI/SQLAlchemy) backend is **not required** and has been decommissioned.
- **Rationale:**
  - For a catalog of 2,000–5,000 books and ~5 users, Supabase provides 100% of required capabilities (queries, joins, search, auth, storage, transactions) with sub-millisecond response times.
  - Eliminates server maintenance, container orchestration, and recurring hosting costs ($0/mo on Vercel + Supabase free tiers).
  - Eliminates schema drift and type synchronization bugs by auto-generating TypeScript definitions directly from Postgres (`supabase gen types typescript`).
- **When to Reconsider:** Introduce external microservices only if heavy non-database workloads arise in the future (e.g., local OCR document parsing or ML model inference).

---

## 3. Phased Roadmap & Functional Priorities

### 🎯 Phase 1: V1 Core App (Streamlined MVP)
*Focus: Get the catalog and essential book management running cleanly with zero friction.*

1. **Book Catalog & Search:**
   - Grid and list view with responsive design.
   - Fast full-text/fuzzy search in both **English and Bengali** (`title`, `title_bn`, `author`, `author_bn`, `isbn`).
   - Filter by genre, language, and read status.
2. **Book Management (CRUD):**
   - **Add Book:** Metadata form with bilingual inputs and physical shelf location (`room`, `shelf`, `column`, `row`).
   - **Cover Image Upload:** Drag-and-drop cover uploads directly to Supabase Storage.
   - **Edit Book:** Update existing metadata and inventory counts.
   - **Delete Book:** Confirmation dialog with immediate removal.
3. **Book Details View:**
   - Modal/Sheet view showing complete metadata, physical location, and copy availability.

---

### 📦 Phase 2: Lending & Circulation Management
*Focus: Manage borrowers and track book checkouts/returns.*

1. **Borrower Profiles:**
   - Add and manage library members (name, phone, email, address, notes).
2. **Lending Transactions:**
   - Checkout book to borrower with expected due date.
   - Automatic decrement/increment of `books.available_copies` on checkout/return.
3. **Overdue & Status Tracking:**
   - Query-based active and overdue loan dashboard (no background cron workers required).

---

### 📚 Phase 3: Personal Bookshelves, Lists & Series
*Focus: Multi-user personalization mapped to the master catalog.*

1. **Master Catalog Mapping:**
   - The master `books` table remains the single source of truth.
   - Personal bookshelves do not duplicate books; they link `user_id` to `book_id`.
2. **Personal Bookshelf Features:**
   - Reading state (`want_to_read`, `reading`, `completed`, `abandoned`).
   - Personal star ratings, reading start/finish dates, and private notes.
   - Personal favorites collection.
3. **User Lists & Book Series:**
   - Custom user lists (e.g., "Favorite Bengali Sci-Fi", "Recommended for Beginners").
   - Ordered book series (e.g., "Feluda Series - Volume 1..N" with sequence ordering).
4. **Data Privacy:**
   - Protected via Supabase Row-Level Security (RLS) so each user manages their own bookshelf and private lists.

---

### ⚙️ Phase 4: Utilities & Enhancements
- Client-side CSV import/export for bulk catalog management.
- Quick statistics dashboard (total books, borrowed count, category breakdown).

---

## 4. Database Schema Design (PostgreSQL)

```sql
-- 1. Master Books Catalog
CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  author TEXT NOT NULL,
  author_bn TEXT,
  isbn TEXT UNIQUE,
  genre TEXT,
  publication_year INT,
  publisher TEXT,
  publisher_bn TEXT,
  language TEXT DEFAULT 'Bengali',
  page_count INT,
  cover_image TEXT,
  total_copies INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  room TEXT,
  shelf TEXT,
  column_location TEXT,
  row_location TEXT,
  location_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Borrowers
CREATE TABLE borrowers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Lending Records
CREATE TABLE lending_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id BIGINT REFERENCES books(id) ON DELETE RESTRICT,
  borrower_id BIGINT REFERENCES borrowers(id) ON DELETE RESTRICT,
  borrow_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Personal Bookshelves
CREATE TABLE user_bookshelves (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
  read_status TEXT DEFAULT 'want_to_read' CHECK (read_status IN ('want_to_read', 'reading', 'completed', 'abandoned')),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  is_favorite BOOLEAN DEFAULT false,
  personal_notes TEXT,
  started_at DATE,
  finished_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- 5. User Lists & Series
CREATE TABLE user_lists (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'list' CHECK (type IN ('list', 'series')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Items in Lists/Series (Ordered)
CREATE TABLE user_list_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  list_id BIGINT REFERENCES user_lists(id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,
  notes TEXT,
  UNIQUE(list_id, book_id)
);
```

---

## 5. Development Strategy & Guidelines

1. **Keep It Simple:** Do not add layers or microservices until real functional demand exists.
2. **Type Safety:** Always generate TypeScript types from the live database (`supabase gen types typescript > types/database.types.ts`).
3. **Security:** Enforce access control directly in Postgres using Row Level Security (RLS) policies.
4. **Deploy Early:** Deploy continuously to Vercel connected to Supabase for immediate live testing.
