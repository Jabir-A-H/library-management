# Project Context
You are working on a library management system built with Next.js 14, TypeScript, React Query v5, and shadcn/ui components. The frontend interfaces with a FastAPI backend that uses PostgreSQL. The project has 664 TypeScript errors across 58 files that need to be systematically fixed.

Recently, the database schema was cleaned up, removing many fields that existed in the frontend codebase. You need to update all frontend components to match the current database schema exactly.

# Main Issues To Fix
1. Database schema misalignment:
   - Components using non-existent fields (isFavorite, publicationYear, numPages, status, etc.)
   - Need to replace with actual db fields (publication_year, page_count, cover_image, read_status)
   
2. UI component type errors:
   - shadcn/ui components missing proper TypeScript interfaces
   - Incorrect prop typing for React components
   
3. API integration issues:
   - Missing or incorrect API methods
   - React Query hooks incorrectly implemented
   
4. File structure problems:
   - Duplicate files (e.g., [id].tsx and [id]_new.tsx)
   - Wrong file extensions (.tsx instead of .ts for non-React files)

# Systematic Fixing Approach
1. Fix the core type definitions first:
   - Ensure frontend/types/*.ts files exactly match backend PostgreSQL schema
   - Remove any fields that don't exist in the database
   - Add proper JSDoc documentation for all types

2. Fix API layer:
   - Update api.ts file (rename from api.tsx if needed)
   - Implement missing API methods
   - Fix any TypeScript errors with proper interfaces

3. Fix React Query hooks:
   - Update reactQueryHooks.ts to use correct types
   - Add any missing mutation or query hooks
   - Ensure proper error handling

4. Fix components in priority order:
   - First fix shared/reusable components (BookCard, BookForm, etc.)
   - Then fix page components (borrowers/[id].tsx, etc.)
   - For each component:
     a. Check what fields it's using vs. what exists in types
     b. Replace all non-existent fields with correct database fields
     c. Fix prop types and interfaces
     d. Update any form data interfaces to match schema
     e. Fix validation logic and form submission

5. Fix UI component issues:
   - Add proper typing for shadcn/ui components
   - Fix Button, Card, and other component prop issues

# Fixing Each Component
For each file you fix:

1. Read the current file thoroughly to understand its purpose
2. Check error output to identify specific TypeScript errors
3. Check the database schema (types folder) to see what fields actually exist
4. Create a plan for the changes needed
5. Fix the component systematically:
   - Update imports if needed
   - Fix interface definitions
   - Update field references to match database
   - Update form handling if applicable
   - Fix validation logic
6. Run TypeScript check to verify fixes worked

Keep a log of what components you've fixed and what issues remain.

# Specific Priority Targets
Fix these files in order (highest priority first):
1. frontend/types/*.ts - Database schema alignment
2. frontend/lib/api.ts - API methods
3. frontend/lib/reactQueryHooks.ts - React Query hooks
4. frontend/components/books/BookCard.tsx - Book display
5. frontend/components/books/BookForm.tsx - Book editing
6. frontend/components/borrowers/BorrowerForm.tsx - Borrower editing
7. frontend/pages/borrowers/[id].tsx - Borrower details
8. frontend/pages/books/index.tsx - Book listing
9. frontend/pages/books/[id].tsx - Book details
10. frontend/pages/lending/index.tsx - Lending management

### When you start working on this task, first analyze the project structure, check the backend database schema, and then begin systematic repairs following this approach.

