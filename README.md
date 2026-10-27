# Recipe Book — MERN Stack Project

A full-stack Recipe Book web application developed as part of the **ICTAK MERN Stack Examination Assessment**. The application allows users to manage recipes through a simple, user-friendly interface.

## Live Demo

🔗 https://recipe-book-mern-wq0n.onrender.com/

## Project Overview

The Recipe Book application helps users store, organize, view, and manage their recipes. It uses the MERN stack to connect a React frontend with an Express and Node.js backend and a MongoDB database.

This project demonstrates the practical application of full-stack web development concepts, REST APIs, database integration, and CRUD operations.

## Features

- **Add Recipes:** Add a recipe with its name, category, ingredients, preparation steps, and cooking time.
- **View Recipes:** Display saved recipes in an organized layout.
- **View Recipe Details:** Access the ingredients and preparation instructions for individual recipes.
- **Edit Recipes:** Update existing recipe information.
- **Delete Recipes:** Remove recipes when they are no longer needed.
- **Recipe Categories:** Organize recipes into Breakfast, Lunch, Dinner, Snack, and Dessert.
- **Form Validation:** Check required fields and cooking-time values.
- **Responsive Interface:** Designed to work across desktop and mobile screen sizes.
- **Database Integration:** Store recipe information in MongoDB.

## Technologies Used

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Database for storing recipes |
| Express.js | Backend framework and REST API |
| React.js | Frontend user interface |
| Node.js | Server-side JavaScript runtime |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layout |
| Render | Application deployment |

## MERN Stack Architecture

The application follows the MERN stack architecture:

1. **React:** Displays the user interface and handles user interactions.
2. **Node.js and Express.js:** Process requests and provide API endpoints.
3. **MongoDB:** Stores recipe information persistently.
4. **REST API:** Connects the frontend with the backend for recipe operations.

## Recipe Information

Each recipe contains the following information:

- Recipe name
- Category
- Ingredients
- Preparation steps
- Cooking time in minutes

## CRUD Operations

The application implements the four basic CRUD operations:

| Operation | HTTP Method | Endpoint |
|---|---|---|
| Retrieve all recipes | GET | `/api/recipes` |
| Retrieve a recipe by ID | GET | `/api/recipes/:id` |
| Add a recipe | POST | `/api/recipes` |
| Update a recipe | PUT | `/api/recipes/:id` |
| Delete a recipe | DELETE | `/api/recipes/:id` |

## Project Structure

The project is organized into frontend and backend components.

```text
recipe-book-mern/
├── backend/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── README.md
```

*Note: The structure above is illustrative. Adjust it to match the actual folders and files in your repository.*

## Running the Project Locally

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
```

Replace the placeholders with your actual GitHub repository URL and folder name.

### 2. Configure the backend

Navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Replace the MongoDB placeholder with your own connection string. Keep credentials private.

Start the backend using the start command defined in `backend/package.json`. If the project defines `npm start`, run:

```bash
npm start
```

### 3. Configure the frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

This value assumes the frontend reads its API base URL from `VITE_API_URL` and the backend runs on port 5000.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Deployment

The application is deployed on Render.

**Live application:** https://recipe-book-mern-wq0n.onrender.com/

The deployed application uses MongoDB Atlas for persistent recipe storage. Environment variables and deployment settings should be configured in Render rather than committing secrets to the repository.

## Learning Outcomes

Through this assessment project, the following concepts are demonstrated:

- Developing a React-based frontend
- Building backend routes using Node.js and Express.js
- Connecting an application to MongoDB
- Implementing REST API endpoints
- Performing CRUD operations
- Validating user input
- Deploying a full-stack application

## Assessment

**Developed as part of the ICTAK MERN Stack Examination Assessment.**

This project demonstrates the practical implementation of concepts covered in MERN stack development.

---

**Project:** Recipe Book Web Application  
**Stack:** MongoDB, Express.js, React.js, Node.js  
**Deployment:** Render  
