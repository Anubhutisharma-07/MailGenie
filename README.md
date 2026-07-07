# 💌 MailGenie – AI Email Writer & Generator

MailGenie is an AI-powered full-stack web application that helps users **generate professional, creative, and personalized emails** effortlessly.  
It uses **Spring Boot** as the backend and **React.js** as the frontend, integrating AI APIs (like Groq Api key) to generate high-quality email content in seconds.

---

## 🚀 Project Preview

---
<p align="center">
  <img src="./maxresdefault.jpg" alt="MailGenie Banner" width="100%" style="border-radius: 12px;"/>
</p>

> *Your AI-powered Email Assistant*


## 🧠 Features

✅ **AI Email Generation** – Generate professional, formal, or creative emails instantly using AI.  
✅ **Customizable Tone & Context** – Choose tone (formal, casual, persuasive, etc.) and add custom prompts.  
✅ **Instant Copy & Share** – Copy generated emails with one click or share via Gmail.  
✅ **Full-Stack Architecture** – Modern frontend with React + RESTful backend using Spring Boot.  
✅ **API Integration** – Connects with Groq API for real-time text generation.  
✅ **Responsive UI** – Built with TailwindCSS and React Hooks for a smooth experience.  
✅ **Error Handling & Logging** – Graceful exception handling on both client and server sides.

---

## 🧩 Tech Stack

**Frontend:**  
- ⚛️ React.js  
- 🎨 Tailwind CSS  
- 🔄 Axios (API calls)  

**Backend:**  
- ☕ Spring Boot (Java 17+)  
- 🌐 RESTful APIs  
- 🔒 Spring WebFlux + WebClient  
- 🧰 Maven  

**AI Integration:**  
- 🤖 Groq API key (or OpenAI API alternative)

---

## 📁 Folder Structure
MailGenie/
├── Backend/
│ └── email-writer-s/ # Spring Boot backend
│ ├── src/
│ ├── pom.xml
│ └── ...


│
├── Frontend/
│ └── emailwriterextension/ # React frontend
│ ├── src/
│ ├── package.json
│ └── ...
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Nicode2707/MailGenie.git
cd MailGenie
2️⃣ Run Backend (Spring Boot)
cd Backend/email-writer-s
mvn spring-boot:run


The backend will start at 👉 http://localhost:8080

3️⃣ Run Frontend (React)
cd ../../Frontend/emailwriterextension
npm install
npm start
