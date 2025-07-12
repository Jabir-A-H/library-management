# Project Analysis Prompts for ছোটপাতা পাঠাগার

This document contains specialized prompts to help analyze and continue work on the Library Management System across different chat sessions. Use these prompts to quickly get context and continue where you left off.

## Quick Context Prompt

When starting a new chat session, use this prompt first:

```
I'm working on a Bengali Library Management System called "ছোটপাতা পাঠাগার" with Next.js 14 + TypeScript frontend and FastAPI backend. The frontend currently has 664 TypeScript errors due to database schema misalignment after recent backend cleanup. 

Key issues:
1. Frontend components use non-existent fields (isFavorite, publicationYear, status) 
2. Database has different fields (publication_year, page_count, read_status)
3. Need systematic component-by-component fixing

Current workspace: f:\WebDev\library-management

Please analyze the current TypeScript errors and continue the systematic fixing approach.
```

## Specific Analysis Prompts

### For TypeScript Error Analysis

```
Please analyze the TypeScript errors in this Next.js 14 project. Focus on:
1. Database schema misalignment issues
2. Missing type definitions for shadcn/ui components
3. API integration problems with React Query
4. Component prop type errors

Run a comprehensive typecheck and identify the top priority files to fix first based on dependency chain.
```

### For Component Repair Work

```
I need to fix TypeScript errors in React components for a library management system. The main issues are:
1. Components using database fields that don't exist (isFavorite, publicationYear, numPages)
2. Need to update to actual database fields (publication_year, page_count, read_status)
3. Fix shadcn/ui component type errors

Please examine the components in frontend/components/ and frontend/pages/ and prioritize fixing by dependency order.
```

### For API Layer Fixes

```
The API layer in lib/api.ts needs comprehensive fixes for TypeScript compliance. Issues include:
1. Remove all 'any' types
2. Add proper interfaces for API requests/responses
3. Align with backend schema changes
4. Fix React Query integration

Please analyze lib/api.ts, lib/reactQueryHooks.ts and create type-safe implementations.
```

### For Database Schema Analysis

```
I need to align frontend TypeScript types with the PostgreSQL database schema. The backend was recently cleaned up but frontend still references old fields. 

Please analyze:
1. Types in frontend/types/ directory
2. Database models in backend/src/models/
3. Create a mapping of old vs new field names
4. Generate updated TypeScript interfaces

Focus on Book, Borrower, LendingRecord, and User types.
```

### For UI/UX Improvement

```
This Bengali library management system needs UI/UX improvements while fixing TypeScript errors. Focus on:
1. Consistent component design patterns
2. Proper error handling UI
3. Loading states and user feedback
4. Accessibility improvements
5. Mobile responsiveness

Please analyze the current component structure and suggest architectural improvements.
```

### For Full System Integration

```
I need to ensure all parts of this library management system work together correctly:
1. API integration between Next.js frontend and FastAPI backend
2. Database operations with proper error handling
3. User flows for book lending, borrower management
4. Data validation and business logic consistency

Please analyze the complete integration and identify any missing pieces.
```

## Debugging Prompts

### For Specific Error Investigation

```
I'm getting TypeScript errors in [COMPONENT_NAME]. The error messages are:
[PASTE_ERROR_MESSAGES]

This is part of a library management system where we recently changed the database schema. Please analyze and fix these specific errors while maintaining consistency with the rest of the codebase.
```

### For Performance Analysis

```
Please analyze the performance characteristics of this Next.js 14 + React Query library management application. Look for:
1. Unnecessary re-renders
2. API call optimization opportunities
3. Bundle size optimizations
4. Loading performance improvements

Focus on the book browsing and lending workflows which are used most frequently.
```

## Continuation Workflow

1. **Start with Quick Context Prompt** to understand current state
2. **Use Specific Analysis Prompt** based on your focus area
3. **Apply systematic fixes** following the migration plan
4. **Validate with TypeScript checks** after each major change
5. **Document progress** and update status files

## Key Files to Always Check

- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/types/` - Type definitions
- `frontend/lib/api.ts` - API layer
- `frontend/components/` - React components
- `backend/src/models/` - Database models
- Error logs and terminal output

---

These prompts are designed to quickly orient any AI assistant to the current state and priorities of the ছোটপাতা পাঠাগার project, enabling seamless continuation of work across different chat sessions.
