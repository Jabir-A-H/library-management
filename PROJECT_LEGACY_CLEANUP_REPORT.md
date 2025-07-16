# Legacy and Potentially Unnecessary Files/Folders in `library-management`

This report lists files and folders that may be remnants of previous tech stacks, are empty, or are likely unnecessary for a modernized, clean project structure. Review and remove/archive as appropriate for your overhaul.

---

## Frontend

- `frontend/components/ui/`  
  * If you are moving to a new UI library or design system, review all custom UI primitives here.
- `frontend/components/common/`  
  * If not used in the new stack, can be removed.
- `frontend/components/books/`, `frontend/components/borrowers/`, `frontend/components/lending/`  
  * If you restructure components, these may be redundant.
- `frontend/pages/api/`  
  * Empty, can be deleted.
- `frontend/src/components/`  
  * Empty, can be deleted.
- `frontend/lib/utils/`  
  * Directory does not exist, but if created by mistake, can be deleted.
- `pnpm-lock.yaml`  
  * If not using pnpm, can be deleted.
- `tsconfig.tsbuildinfo`  
  * Auto-generated, can be deleted.

## Backend

- `backend/src/static/`  
  * Empty, can be deleted.
- `backend/src/db/`  
  * Contains only `auth.py` and `__init__.py`. If not used, can be deleted.
- `backend/src/database/`  
  * Contains only `__init__.py`. If not used, can be deleted.
- `backend/src/utils/__init__.py`, `backend/src/dependencies/__init__.py`  
  * Empty, can be deleted.
- `__pycache__/` folders (anywhere)  
  * Auto-generated, can be deleted.

## Extras, Scripts, and Miscellaneous

- `extras/`  
  * Contains images, scripts, and markdowns. Move only what you need.
- `testing/`  
  * If not using the current test scripts or structure, can be deleted.
- Any `.bat`, `.ps1`, `.sql` scripts in root or `extras/`  
  * Remove if not part of your new workflow.

## General Recommendations

- Remove or archive legacy/unused folders and files.
- Migrate only the code, assets, and configs you need for the new stack.
- Reorganize according to a clean, modular structure.

---

**Review this list before deleting. Some files may be needed for migration or reference.**
