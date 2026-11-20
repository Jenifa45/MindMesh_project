# Mind-Mesh-project
A collaborative AI workspace combining project management, document-aware chat, and multi-agent task execution with real-time visual feedback.


# Mind-Mesh Project

## Table of Contents

- [Git Commands](#git-commands)
- [Run the application](#run-the-application)
- [Backend Setup](#backend-setup)

---

## Git Commands

| Step | Purpose | Command |
|------|---------|---------|
| 1 | Clone the repository | `git clone https://github.com/Jenifa02/Mind-Mesh-project.git` |
| 2 | Add changes | `git add .` |
| 3 | Commit changes | `git commit -m "your changes"` |
| 4 | Push to your branch | `git push origin <your-branch>` |
| 5 | Get the latest code | `git pull origin main` |
| 6 | Switch branch | `git checkout <branch-name>` |
| 7 | Check all branches | `git branch -a` |
| 8 | Check status | `git status` |

---

## Frontend Setup

The frontend is built with **Next.js**, **TypeScript** and **Tailwind CSS**.

### 1. Project initialization

```bash
mkdir cognitive-workspace && cd cognitive-workspace
git init
npm init -y
npm install --save-dev concurrently
npm install
```

| Command | Purpose |
|---------|---------|
| `git init` | Initializes the project as a Git repository |
| `npm init -y` | Creates the root `package.json` file |
| `npm install --save-dev concurrently` | Installs **Concurrently** to run multiple services (frontend and backend) with a single command |
| `npm install` | Installs the dependencies listed in `package.json` |

### 2. Create the Next.js app

```bash
npx create-next-app@latest frontend --ts --tailwind --app --eslint --use-npm
```

| Option | Purpose |
|--------|---------|
| `npx create-next-app@latest frontend` | Creates a new **Next.js application** inside the `frontend` folder |
| `--ts` | Enables **TypeScript** |
| `--tailwind` | Sets up **Tailwind CSS** for styling |
| `--app` | Uses the **Next.js App Router** |
| `--eslint` | Enables **ESLint** for code quality and error checking |
| `--use-npm` | Uses **npm** as the package manager |

## Run the application

```bash
npm install
npm run dev
```

Run these commands from the project root. They start both the frontend at `http://localhost:3000` and the backend API at `http://localhost:8000`.

---

## Backend Setup

The backend is built with **FastAPI** and runs locally using **Uvicorn**.

### 1. Activate the virtual environment

```powershell
cd backend
.venv\Scripts\activate
```

**Purpose:** Activates the Python virtual environment so that all backend packages are installed and used within the project.

### 2. Install FastAPI and Uvicorn

```powershell
pip install fastapi uvicorn
```

**Purpose:**

- **FastAPI** – Used to build the backend API and define API routes/endpoints.
- **Uvicorn** – Used as the ASGI server to run the FastAPI application locally.

### 3. Generate `requirements.txt`

```powershell
pip freeze > requirements.txt
```

**Purpose:** Stores the installed Python packages and their versions in `requirements.txt`, so the same dependencies can be installed easily on another system.

### 4. Run the FastAPI application

```powershell
uvicorn app.main:app --reload --port 8000
```

**Purpose:** Starts the FastAPI application locally using Uvicorn. The API docs are available at `http://127.0.0.1:8000/docs`.
