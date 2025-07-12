---
applyTo: 'copilot'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

The library name is ছোটপাতা পাঠাগার or Chotopata Pathagar in english. Use bengali for when it is displayed to the users.

always prefer cmd over powershell. I am on a windows pc, so give windows supported commands in cmd. i prefer long term solutions, not quick fixes. Use industry best practices and standards.

If a file is opened in the editor, do the following:
# Perform a complete review and improvement of the entire project frontend part

1. Analyze the overall project structure, purpose, backend, frontend and architecture
2. Review all files to identify:
   - Syntax errors
   - Bad code practices
   - Performance bottlenecks
   - Inconsistent patterns or structure
   - Deprecated or outdated dependencies
   - Missing error handling or validation
3. Refactor unoptimized or duplicated logic
4. Ensure all modules/components/services work together seamlessly
5. Make sure all dependencies are correctly installed and imported
6. Identify any unused or outdated packages or files
7. Standardize naming conventions, folder structures, and patterns
8. Suggest improvements to architecture if needed (e.g. modularity, separation of concerns)
9. After review, identify files that need deep rewriting and send them for file-level fix

Avoid making shallow changes. Focus on deep architectural consistency, integration correctness, and clean maintainable code.

# file-level fix:

## Thoroughly analyze and improve each file

1. **Understand the file's context**:
   - Identify the language, framework, and purpose of this file
   - Determine how it fits within the larger project
   - Use the backend directory to know how everything in backend works and match the frontend to that

2. **Find and fix issues**:
   - Fix all syntax, compilation, and runtime errors
   - Add any feature that the file should have based on the backend and the larger project
   - Remove unused code, imports, and variables
   - Improve performance, readability, and maintainability
   - Replace deprecated patterns with modern alternatives
   - Add proper error handling and cover edge cases

3. **Check integrations**:
   - Ensure APIs, components, or utilities used here are correctly implemented
   - Confirm compatibility with other project files and modules
   - Ensure compatibility with the backend and frontend

4. **Check types and dependencies**:
   - Validate all imports are correct and up to date
   - Ensure TypeScript types (if any) are accurate and complete

5. **Improve documentation**:
   - Add or improve doc comments for all functions, methods, and classes
   - Ensure comments are accurate, helpful, and reflect the current logic

6. **Ensure consistent style**:
   - Follow consistent formatting and coding conventions used across the project

7. **Apply changes directly**:
   - Implement all fixes and improvements directly in the file

After fixing, confirm that the file is error-free and still functions as intended.

Please be thorough and fix everything you find.

After each change, validate it before moving to the next step.

No need to show what you changed in the files to me.