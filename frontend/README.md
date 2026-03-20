# UniNotes Frontend 🎨

> **⚠️ DISCLAIMER:** This project is a production of AI-assisted development. While the logic and structure have been refined, it was initially generated and iterated upon using advanced AI coding assistants.

UniNotes is a modern, high-performance web application designed for students to share and access academic resources like notes, PYQs, and solutions.

---

## 🚀 Quick Start Instructions

Follow these steps to get the frontend running on your local machine:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
# Navigate to the frontend directory
cd frontend

# Install all required packages
npm install
```

### 3. Environment Setup
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Development Mode
Start the Vite development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Production Build
To create an optimized production bundle:
```bash
npm run build
```
The output will be in the `dist/` folder.

---

## 🛠️ Technology Stack

- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **State & Data:** [TanStack Query (React Query)](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 📂 Project Structure

- `src/components`: Reusable UI components (shadcn + custom)
- `src/pages`: Main application views/pages
- `src/hooks`: Custom React hooks for logic reuse
- `src/services`: API communication logic (Axios fetchers)
- `src/lib`: Utility functions and configuration (e.g., `utils.ts` for Tailwind)

---
*Built with focus on user experience, speed, and clean design.*
