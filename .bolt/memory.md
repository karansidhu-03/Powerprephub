# Project memory

## Product intent & audience

- Exam/study preparation web app presenting books, chapters, and questions.
- Content is organized into Parts (e.g., Part B), each containing multiple Books.
- Each Book has chapters and may include a full-book exam.
- Audience likely learners or candidates preparing for industrial/engineering certification exams.

## Brand personality & voice

- Utilitarian and content-focused; minimal narrative copy.
- Labels and headings are descriptive (e.g., "Book B12 — Typical Industrial Plant Configurations").

## Visual design & UX direction

- Built with Vite + React.
- Page-per-Part structure (e.g., Part B page lists its books).
- Book sections grouped under headings with chapter and exam content.
- Content is data-driven: question files are stored as data and wired into the site rather than hardcoded.
- Prefer ensuring all data files are connected to pages; avoid leaving orphaned question files.

## Decisions, constraints & rationale

- Data files are the source of truth for questions; UI imports and renders them.
- Book B12 (full-book exam + both chapters) is connected on the Part B page.
- All question files in the project are verified as connected; no orphaned content expected.
- "Apply new changes from new commit" typically means diffing data/file lists against what's already wired; if identical, no action needed.

## Open questions & assumptions

- Assumed "new commit" refers to data file additions/updates rather than structural UI changes.
- If a change is intended beyond data wiring (fixes, heading text, layout), the user needs to specify explicitly.
- Unknown whether there are Parts beyond B and how their pages are structured.
- Unknown version-control integration; currently relying on file-list/content comparison rather than actual git diffing.