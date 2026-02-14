<img src="./src/assets/logo.png" style="width: 50px, heigth:50px">

# ADMINPORTAL

## 📌 Project Overview
This is a simple Admin Dashboard built with **React, Vite, and Material UI** as part of a technical assessment.
It demonstrates:
- Basic CRUD operations (users & posts)
- State management with Zustand
- Mock backend integration via JSON Server
- Responsive UI with Material UI components

## 🛠 Tech Stack
- **React (Vite)** – Frontend framework
- **Material UI** – UI library
- **Zustand** – Global state management
- **Axios** – HTTP client
- **JSON Server** – Mock backend
- **React Router** – Routing

##🏗 Project Structure

src/
│
├── api/          # Axios setup
├── auth/         # Authentication logic and types
├── components/   # Reusable components (Drawer, Table, Cards)
├── pages/        # Pages (Dashboard, Login, Users)
├── store/        # Zustand stores (users, posts, layout)
├── utils/        # Helper functions
└── assets/       # Images, icons


## 🔐 Features

**Authentication**
- Login/logout
- Reactive state for user session
- Clearing credentials on logout

**User Management**
- List table users
- Create / Edit / Delete user
- Drawer-based form for create/edit

**Posts Dashboard**
- Search posts by title
- Filter by category
- Responsive cards
- Empty state and loading state handling

## ⚙️ How to install

1️⃣ Install dependencies
```bash
npm install
```

2️⃣ Start JSON Server
```bash
json-server --watch db.json --port 3001

```
3️⃣ Start Vite development server
```bash
npm run dev: all
```

Access the app at: http://localhost:5173

##📊 What This Shows
Even as a junior developer, this project demonstrates:
- Understanding of React & component-based architecture
- Ability to manage state with Zustand
- Handling CRUD operations and async logic
- UI feedback management (loading, error, empty states)
- Problem-solving and attention to edge cases

Cristina Palmisani 👩🏼‍🎨👩🏽‍💻

🧑‍💻 [LinkedIn](https://www.linkedin.com/in/cristina-palmisani-fullstack-developer/)
