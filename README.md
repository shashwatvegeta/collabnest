# CollabNest

## 📌 Overview  
CollabNest is a **platform** that bridges the gap between **students, mentors, and professors**, allowing students to participate in structured projects and gain **practical experience**.  

## 🚀 Features
- ✅ **Project-Based Learning** – Students can browse and join projects.  
- ✅ **Mentor-Guided System** – Senior students mentor juniors.  
- ✅ **Professor Collaboration** – Professors can list research opportunities.  
- ✅ **Smart Recommendations** – AI-powered project suggestions.  
- ✅ **Gamification** – XP points, badges, and leaderboards.  
- ✅ **Auto-Certification** – Generates certificates upon project completion.  

---

## 🏗 Tech Stack

### 🔹 Frontend  
- **Next.js** – UI framework  
- **Tailwind CSS** – Styling  

### 🔹 Backend  
- **Node.js** – Server  
- **Nest.js** – API framework  
- **MongoDB** – NoSQL database  
- **Mongoose** – ODM for MongoDB  

### 🔹 Authentication & Security  
- **MicroSoft Auth** – Secure authentication  
- **RBAC (Role-Based Access Control)** – Manage user roles  

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/shashwatvegeta/collabnest.git
cd collabnest
```

### 2️⃣ Run Backend
```
cd backend
npm install  # Install backend dependencies
npm run start  # Run server code
```

### 2️⃣ Run Frontend
```
cd frontend
npm install  # Install frontend dependencies
npm run dev  # Run client side code
```

### 3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add:
```
MONGO_URI=your_mongodb_uri
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```