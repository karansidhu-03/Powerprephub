# Power Prep Hub

A modern, responsive web application designed for practicing Power Engineering multiple-choice question (MCQ) exams. The application provides a clean, distraction-free testing and learning experience tailored for aspiring engineers.

> **A Note from the Creator:** 
> I built this platform for myself to help study, and I truly hope it helps anyone out there preparing for their Power Engineering exams. Good luck with your studies—feel free to use this entirely for free!

## Core Features

1. **Quiz Structure & Navigation**
   - Practice exams structured around comprehensive question sets (e.g., 100-question practice modules).
   - Clean dashboard header displaying real-time progress indicators, an exam timer, and a quick-jump question navigator grid.

2. **Interactive Question Card**
   - Single-question display view optimized for focus.
   - Four distinct option buttons (A, B, C, D) for every question.

3. **Instant Feedback & Learning Mode**
   - Immediate visual response upon selection:
     - Correct choices highlight in solid green.
     - Incorrect choices highlight in solid red, alongside the correct answer.
   - Detailed explanation box revealed immediately beneath the options upon locking in an answer.
   - Prevention of multiple selections to secure authentic testing results.

4. **Results & Summary Screen**
   - Comprehensive end-of-test breakdown displaying final score percentages, correct/incorrect tallies, and a complete question-by-question review list.

5. **Data Structure & Expandability**
   - Organized JSON-based data architecture (`id`, `question`, `options`, `correctAnswer`, `explanation`) for seamless expansion of future exam sets.
   - Modern, professional UI styled with Tailwind CSS and Lucide icons.