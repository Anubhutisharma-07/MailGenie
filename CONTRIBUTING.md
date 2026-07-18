# Contributing to MailGenie

First off, thank you for taking the time to contribute! 🎉 Contributions are what make the open-source community such an amazing place to learn, inspire, and create. 

This guide provides the necessary guidelines and steps to help you set up the project locally, adhere to coding standards, and submit high-quality pull requests.

---

## 📂 Project Structure

Before getting started, take a moment to understand how the repository is structured:

MailGenie-main/
├── Backend/                    # Java Spring Boot backend application
│   └── email-writer-s/         # Core Spring Boot project (Maven-based)
├── frontend/                   # React frontend application
│   └── EmailwriterGenerator/   # Frontend build with Vite, TailwindCSS
├── emailwriterextension/       # Chrome Extension files (manifest, content/popup scripts)
└── README.md                   # Main project documentation

---

## 🛠️ Local Project Setup

### Prerequisites
Ensure you have the following installed on your local machine:
* **Java Development Kit (JDK 17 or higher)**
* **Apache Maven**
* **Node.js (v18 or higher)** and `npm`
* **Google Chrome Browser** (for testing the extension)

### 1. Setting Up the Backend
1. Navigate to the backend directory:
   cd Backend/email-writer-s
2. Copy the example properties file and configure your environment variables (e.g., database configs, API keys):
   cp src/main/resources/application.properties.example src/main/resources/application.properties
3. Build and install dependencies:
   mvn clean install
4. Run the Spring Boot application:
   mvn spring-boot:run

### 2. Setting Up the Frontend
1. Navigate to the frontend workspace:
   cd frontend/EmailwriterGenerator
2. Install the necessary node modules:
   npm install
3. Launch the local Vite development server:
   npm run dev

### 3. Loading the Chrome Extension
1. Open Google Chrome and type `chrome://extensions/` in the address bar.
2. Enable **Developer mode** using the toggle switch in the top right corner.
3. Click on the **Load unpacked** button in the top left corner.
4. Select the `emailwriterextension/` folder from this repository root.

---

## 🌿 Git Workflow & Conventions

### Branch Naming
When creating a new branch, please follow a descriptive naming convention:
* Feature branches: `feat/short-description`
* Bug fixes: `fix/short-description`
* Documentation updates: `docs/short-description`

### Commit Messages
We encourage clean, structured commit messages to make the project history easy to read:
* Use the present tense ("Add feature" instead of "Added feature").
* Reference relevant issues at the end if applicable.
* **Format:** `<type>(<scope>): <short summary>`
  * *Example:* `feat(backend): implement EmailHistory tracking endpoint`
  * *Example:* `fix(frontend): adjust layout constraint on contact page`

---

## 💻 Coding Standards & Best Practices

### Backend (Java/Spring Boot)
* Adhere to standard Java naming conventions (CamelCase for classes/variables).
* Keep controllers thin; place business logic strictly within service classes.
* Ensure all database interaction repositories extend the appropriate Spring Data interfaces.
* Do not commit sensitive credentials inside `application.properties`.

### Frontend (React/JavaScript)
* Write functional components with hooks.
* Use meaningful component names and split complex components into smaller, reusable UI pieces inside the `components/` directory.
* Run formatting/linting toolchecks (`npm run lint` if configured) before committing code.

---

## 🔄 How to Submit a Contribution

1. **Fork the Repository:** Create a personal copy of this repository on GitHub.
2. **Clone the Fork:** Clone your personal fork to your local environment.
3. **Create a Branch:** Create a fresh branch off `main` following our branch naming convention.
4. **Implement & Test:** Make your modifications. Ensure both frontend and backend compilation steps pass successfully.
5. **Commit & Push:** Commit your changes with a clear summary message and push the branch to your GitHub fork.
6. **Open a Pull Request (PR):** Navigate back to the original repository and click "New Pull Request". Provide a clear summary description of what your PR accomplishes.

---

## 📋 Contributor Checklist
Before opening a Pull Request, verify that you have checked off the following:
- [ ] My code compiles successfully locally without any errors.
- [ ] I have followed the project's branch naming and commit conventions.
- [ ] No sensitive environment configuration details have been exposed or committed.
- [ ] I have verified my changes across the specific stack layer I modified (Backend, Frontend, or Extension).
- [ ] My PR points to the `main` branch of the parent repository.

Thank you for helping improve MailGenie! 🚀