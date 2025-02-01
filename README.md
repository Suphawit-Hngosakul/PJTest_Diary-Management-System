# PJTest_Diary-Management-System

# Architecture Overview

## Components

| Component        | Technology | 
|------------------|------------|
| **Frontend**     | React      |
| **Backend**      | Node.js    |
| **Database**     | MongoDB    |

---

## User Actions

| Action          | Description                          |
|-----------------|--------------------------------------|
| **Login**       | Authenticate user.                   |
| **Register**    | Create a new user account.           |
| **Add Diary**   | Add a new diary entry.               |
| **Edit Diary**  | Modify an existing diary entry.      |
| **Delete Diary**| Remove a diary entry.                |
| **Search Diary**| Search for diary entries.            |

---

## API Endpoints

| Endpoint               | Description                          |
|------------------------|--------------------------------------|
| **/auth/login**        | Endpoint for user login.             |
| **/auth/register**     | Endpoint for user registration.      |
| **/diaries**           | Endpoint for managing diary entries. |
| **/diaries/:id**       | Endpoint for managing a specific diary entry. |
| **/diaries/search**    | Endpoint for searching diary entries.|

---

## Database Collections

| Collection | Description                  |
|------------|------------------------------|
| **users**  | Stores user information.     |
| **diaries**| Stores diary entries.        |




# Install

### Backend
	npm i bcrypt cors dotenv express jsonwebtoken mongoose morgan
	npm i nodemon -D
	npm init -y

### Frontend
	npm create vite@latest
	cd frontend
	npm i axios jwt-decode react-router-dom
	npm install tailwindcss @tailwindcss/vite

#### vite.config.ts
	import tailwindcss from '@tailwindcss/vite'
	export default defineConfig({ plugins: [ tailwindcss(), ],})
	
	CSS
	@import "tailwindcss";
	