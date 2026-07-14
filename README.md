<div align="center">

# 💌 MailGenie
### AI-Powered Email Writer & Gmail Reply Assistant

Generate professional, personalized email replies in seconds — right inside Gmail, or standalone in your browser.

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Groq](https://img.shields.io/badge/Groq%20API-F55036?style=for-the-badge&logo=lightning&logoColor=white)](https://console.groq.com/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<p align="center">
  <img src="./maxresdefault.jpg" alt="MailGenie Banner" width="100%" style="border-radius: 12px;"/>
</p>

</div>

---

## ✨ What is MailGenie?

MailGenie is a full-stack, AI-powered email assistant with **three connected pieces**:

| Piece | What it does |
|---|---|
| 🧠 **Spring Boot Backend** | Receives email content + tone, calls the Groq LLM API, returns a generated reply |
| ⚛️ **React Frontend** | Standalone web UI — paste any email, pick a tone, get an instant reply, copy to clipboard |
| 🧩 **Chrome Extension** | Injects an **"AI Reply"** button directly into Gmail's compose toolbar — reads the email thread automatically and writes the reply for you |

> Type less. Reply faster. Sound just as professional.

---

## 🎬 See it in action

```
📧 You open an email in Gmail
        ↓
🖱️  Click "AI Reply" next to Send
        ↓
🧠 Groq's LLM reads the email + generates a contextual reply
        ↓
✍️  Reply is typed directly into your compose box
        ↓
✅ Review, edit if needed, hit Send
```

---

## 🧠 Features

- ✅ **AI Email Generation** — instant professional, formal, or casual replies
- ✅ **Customizable Tone** — formal, casual, persuasive, friendly & more
- ✅ **Gmail Integration** — one click, right inside your compose toolbar
- ✅ **Standalone Web UI** — for drafting replies outside Gmail too
- ✅ **Instant Copy & Insert** — no manual retyping
- ✅ **Fast Inference** — powered by Groq's LPU inference (near-instant responses)
- ✅ **Clean Error Handling** — clear feedback on both client and server

---

## 🧩 Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- ⚛️ React.js
- 🎨 Material UI
- 🔄 Axios

</td>
<td valign="top" width="33%">

**Backend**
- ☕ Spring Boot (Java 17+)
- 🌐 RESTful APIs
- 🔌 Spring WebFlux + WebClient
- 🧰 Maven

</td>
<td valign="top" width="33%">

**AI + Extension**
- ⚡ Groq API (Llama 3.3 70B)
- 🧩 Chrome Extension (Manifest V3)
- 👀 MutationObserver DOM injection

</td>
</tr>
</table>

---

## 📁 Project Structure

```
MailGenie/
├── Backend/
│   └── email-writer-s/            # Spring Boot backend
│       ├── src/main/java/com/email/writer/
│       │   ├── EmailGeneratorController.java
│       │   ├── EmailGeneratorService.java
│       │   ├── EmailRequest.java
│       │   └── EmailWriterSApplication.java
│       ├── src/main/resources/
│       │   └── application.properties.example   # copy → application.properties
│       └── pom.xml
│
├── emailwriterextension/          # Chrome Extension (Manifest V3)
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   └── icons/
│
├── frontend/
│   └── EmailwriterGenerator/      # Standalone React app
│       ├── src/
│       └── package.json
│
├── LICENSE
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Nicode2707/MailGenie.git
cd MailGenie
```

### 2️⃣ Get a free Groq API key
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign in and click **Create API Key**
3. Copy the key (starts with `gsk_...`)

### 3️⃣ Configure & run the backend
```bash
cd Backend/email-writer-s
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
Open the new `application.properties` and paste your key:
```properties
spring.application.name=email-writer-s
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.api.key=your_groq_api_key_here
```
Then run:
```bash
mvn spring-boot:run
```
✅ Backend live at **http://localhost:8080**

### 4️⃣ Run the standalone React frontend (optional)
```bash
cd frontend/EmailwriterGenerator
npm install
npm run dev
```

### 5️⃣ Load the Chrome Extension
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `emailwriterextension/` folder
5. Open Gmail → open any email → click **Reply** → click **AI Reply** 🎉

> ⚠️ The backend must be running locally on port `8080` for both the extension and the React app to work.

---

## 🔐 Security Note

`application.properties` (with your real API key) is **git-ignored** on purpose. Never commit real API keys — always use `application.properties.example` as the shareable template.

---

## 🛣️ Roadmap

- [x] Tone selector inside the Gmail extension UI
- [x] Support for additional LLM providers (OpenAI, Claude, Gemini)
- [x] Reply history / saved templates
- [x] Multi-language support

---

## 📄 License

Licensed under the [MIT License](./LICENSE).

---

<div align="center">

Made with 💌 by [Niraj Kumar](https://github.com/Nicode2707)

⭐ If this project helped you, consider giving it a star!

</div>
