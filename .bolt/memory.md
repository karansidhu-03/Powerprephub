# Project memory

## Product intent & audience

- Exam/study preparation web app presenting books, chapters, and questions.
- Content is organized into Parts (e.g., Part B), each containing multiple Books.
- Each Book has chapters and may include a full-book exam.
- Audience likely learners or candidates preparing for industrial/engineering certification exams.

## Brand personality & voice

- Utilitarian and content-focused; minimal narrative copy.
- Labels and headings are descriptive (e.g., "Book B10 — HVAC Fundamentals for Facility Operators").

## Visual design & UX direction

- Built with Vite + React.
- Page-per-Part structure (e.g., Part B page lists its books).
- Book sections grouped under headings with chapter and exam content.
- Content is data-driven: question files are stored as data and wired into the site rather than hardcoded.
- Prefer ensuring all data files are connected to pages; avoid leaving orphaned question files.

## Decisions, constraints & rationale

- Data files are the source of truth for questions; UI imports and renders them.
- Books connected on Part B page: B10, B11, B12.
- Book B10 heading: "HVAC Fundamentals for Facility Operators"; has chapters 4–6 (Ventilation and Air Filters, HVAC Duct Systems, Types of Coils and Operation; 60 questions). Chapters 1–3 and full-book exam not yet on disk.
- Book B11 heading: "Building Environmental Systems and Control".
- Book B12 has full-book exam + both chapters connected.
- "Apply new changes from commit" means diffing data/file lists against what's already wired and connecting any new files; also apply explicit heading/text changes the user specifies.

## Open questions & assumptions

- Book B10 chapters 1–3 and full-book exam are expected to arrive in future commits; will need wiring then.
- Unknown whether there are Parts beyond B and how their pages are structured.
- Unknown version-control integration; currently relying on file-list/content comparison rather than actual git diffing.
- Chapter numbering may not start at 1 for all books (B10 began at chapter 4).