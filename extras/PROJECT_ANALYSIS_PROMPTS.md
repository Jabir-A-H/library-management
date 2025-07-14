# Project Analysis Prompts

This document contains two specialized prompts for analyzing and fixing issues in the codebase:

1. **Project-Wide Analysis Prompt**: Use this to identify all problematic files in the project
2. **File-Specific Fix Prompt**: Use this to thoroughly fix individual files

## 1. Project-Wide Analysis Prompt

```
# Comprehensive Frontend Project Analysis

Analyze the entire frontend codebase of our library management system (ছোটপাতা পাঠাগার) and identify files that need repair. The project uses Next.js 14, TypeScript, React Query v5, and shadcn/ui components.

## Context
The frontend interfaces with a FastAPI backend that uses PostgreSQL. There are approximately 664 TypeScript errors across 58 files that need to be systematically fixed.

Recently, the database schema was cleaned up, removing many fields that existed in the frontend codebase. You need to identify all components that need updating to match the current database schema.

## Main Issue Categories
1. Database schema misalignment (using non-existent fields like isFavorite, publicationYear instead of publication_year)
2. UI component type errors (shadcn/ui components missing proper TypeScript interfaces)
3. API integration issues (missing or incorrect API methods)
4. File structure problems (duplicate files, wrong file extensions)

## Analysis Steps

1. Analyze the project structure and organization
2. Check TypeScript error patterns across files
3. Identify components using outdated field names
4. Find API integration issues
5. Detect component type issues
6. Look for duplicate files or incorrect file extensions

## Requested Output

1. A prioritized list of files that need fixing
2. For each file:
   - The specific issues identified
   - The severity of the issues (critical, high, medium, low)
   - Estimated effort to fix (simple, moderate, complex)
   - Dependencies that might be affected

3. Group files by issue category for systematic fixing:
   - Type definition issues
   - API layer issues
   - React Query hook issues
   - Component field alignment issues
   - UI component type issues

4. Suggest an order of fixes that would minimize cascading impacts

No need to fix any code yet - just identify and categorize the issues in detail so we can systematically address them with the file-specific prompt.
```

## 2. File-Specific Fix Prompt

```
# Comprehensive File-Specific Fix for Library Management System

## Project Context
You are working on a library management system built with Next.js 14, TypeScript, React Query v5, and shadcn/ui components. The frontend interfaces with a FastAPI backend that uses PostgreSQL.

Recently, the database schema was cleaned up, removing many fields that existed in the frontend codebase. You need to update all frontend components to match the current database schema exactly.

## File Analysis and Fix Instructions

1. **Analyze the current file thoroughly**:
   - Read the entire file to understand its purpose and functionality
   - Identify how it integrates with the rest of the system
   - Check the backend schema to understand the correct data structure
   - Note all TypeScript errors and their root causes

2. **Fix database schema alignment issues**:
   - Replace non-existent fields (isFavorite, publicationYear, numPages, status, etc.)
   - Use actual database fields (publication_year, page_count, cover_image, read_status)
   - Update any form data interfaces to match the database schema
   - Fix validation logic to validate against the correct field names

3. **Fix TypeScript and component issues**:
   - Add proper TypeScript interfaces for shadcn/ui components
   - Fix incorrect prop types and component interfaces
   - Remove any `any` type usage with proper typing
   - Fix component state management issues

4. **Fix API integration issues**:
   - Update API calls to use correct field names
   - Implement proper error handling for API responses
   - Fix React Query hooks to use correct types and parameters
   - Update form submission to match API expectations

5. **Improve code quality and performance**:
   - Add proper error handling and user feedback
   - Optimize component rendering with memoization when appropriate
   - Add comprehensive JSDoc documentation
   - Remove unused imports and variables

6. **Verify your changes**:
   - Ensure the component still fulfills its intended purpose
   - Check that all TypeScript errors are resolved
   - Verify integration with other components is maintained

## Implementation Guidelines
- Focus on comprehensive, deep fixes rather than surface-level changes
- Follow the existing code style and patterns
- Add detailed comments explaining complex logic
- Use modern React patterns (hooks, functional components)
- Ensure type safety throughout the codebase

After you complete the fixes, summarize what issues were found and how they were resolved.
```

These prompts are designed to work together - first use the project-wide analysis to identify problematic files, then use the file-specific fix prompt to thoroughly repair each identified file.
