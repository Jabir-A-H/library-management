# Backend Python Error Fixing Plan (2025-07-16)

This file categorizes all detected errors in the backend Python codebase, grouped by error type and per file. Use this as a checklist for systematic fixes.

---

## Error Categories

### 1. Style & Formatting (PEP8)
- Lines exceeding 79 characters
- Missing blank lines before class/function definitions
- Trailing whitespace
- Unexpected spaces around keyword/parameter equals

### 2. Type Hinting & Type Safety
- Use of generic `dict` without type arguments (should specify, e.g., `dict[str, Any]`)
- Type of variables and parameters is partially unknown (incomplete type hints)
- Return type partially unknown for some functions
- Type annotation missing for parameters

### 3. Deprecated/Best Practice Issues
- Deprecated usage of `datetime.utcnow()` (should use timezone-aware `datetime.now(datetime.timezone.utc)`)

### 4. Unused Imports
- Unused imports (e.g., `sqlalchemy.or_`, `sqlalchemy.update`, `typing.Dict`)

---

## Errors by File

### backend/src/utils/auth.py
- [Style] Lines too long
- [Style] Missing blank lines before class
- [Type] Generic `dict` without type arguments
- [Type] Partially unknown types for variables/parameters
- [Type] Return type partially unknown
- [Best Practice] Deprecated `datetime.utcnow()`

### backend/src/schemas/lending_record.py
- [Style] Lines too long
- [Style] Missing blank lines before class
- [Style] Trailing whitespace
- [Style] Visually indented line with same indent as next logical line
- [Type] Generic `dict` without type arguments
- [Type] Type annotation missing for parameter `v`
- [Type] Return type unknown for `validate_new_due_date`

### backend/src/schemas/user_favorite.py
- [Style] Lines too long
- [Style] Missing blank lines before class
- [Type] Generic `Dict` without type arguments

### backend/src/schemas/tag_updated.py
- [Style] Lines too long
- [Style] Missing blank lines before class

### backend/src/schemas/tag.py
- [Style] Lines too long
- [Style] Missing blank lines before class

### backend/src/schemas/user.py
- [Style] Lines too long
- [Style] Missing blank lines before class

### backend/src/routes/user_favorite_async.py
- [Style] Lines too long
- [Style] Missing blank lines before class/function
- [Style] Trailing whitespace
- [Type] Unused imports (`typing.Dict`, `sqlalchemy.or_`, unused schema imports)

### backend/src/routes/lending_async.py
- [Style] Lines too long
- [Style] Missing blank lines before class/function
- [Style] Trailing whitespace
- [Style] Unexpected spaces around keyword/parameter equals
- [Type] Unused imports (`sqlalchemy.or_`, `sqlalchemy.update`)

### backend/src/schemas/lending_record.py
- [Type] Generic `dict` without type arguments
- [Type] Type annotation missing for parameter `v`
- [Type] Return type unknown for `validate_new_due_date`

---

## Files With No Errors
- backend/testing/*
- backend/alembic/*
- backend/src/server.py
- backend/src/routes/user_async.py
- backend/src/routes/export.py
- backend/src/routes/borrower_async.py
- backend/src/routes/book_async.py
- backend/src/routes/auth_async.py
- backend/src/schemas/user_favorite_updated.py
- backend/src/schemas/user_updated.py
- backend/src/schemas/category_updated.py
- backend/src/schemas/category.py
- backend/src/schemas/borrower_updated.py
- backend/src/schemas/borrower.py
- backend/src/schemas/book_updated.py
- backend/src/schemas/book.py

---

## Next Steps
- Address errors by category and file, starting with style/formatting, then type hinting, then best practices and unused imports.
- Use this plan as a checklist for systematic backend code improvement.

---

## Fixing Plan: Priority Order

### 1. Critical: Type Safety & Deprecated Usage
- Fix all incomplete type hints, add explicit types for dicts, parameters, and return values.
- Update all deprecated usages (e.g., replace `datetime.utcnow()` with `datetime.now(datetime.timezone.utc)`).
- Address unknown/ambiguous types in validators and models.

### 2. High: Unused Imports & Logical Errors
- Remove all unused imports to prevent confusion and potential runtime errors.
- Check for any logical errors or ambiguous code due to unused/incorrect imports.

### 3. Medium: Style & Formatting (PEP8)
- Shorten all lines exceeding 79 characters.
- Add missing blank lines before class/function definitions.
- Remove trailing whitespace and fix indentation issues.
- Correct unexpected spaces around keyword/parameter equals.

### 4. Low: Documentation & Comments
- Add/clarify docstrings for complex functions/classes.
- Ensure comments are up-to-date and helpful.

---

### Recommended Fixing Workflow
1. Start with type safety and deprecated usage in all files listed above.
2. Remove unused imports and check for logical errors.
3. Apply PEP8 formatting and style fixes.
4. Review and improve documentation/comments as needed.
5. Run tests after each major category of fixes to ensure stability.
