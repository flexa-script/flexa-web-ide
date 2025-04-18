# Flexa Web IDE

[![Flexa](https://img.shields.io/badge/Made_for-Flexa-purple.svg)](https://github.com/flexa-script)
[![License](https://img.shields.io/github/license/flexa-script/flexa-web-ide)](LICENSE)

**Flexa Web IDE** is a modern, browser-based interface for writing, running, and testing [Flexa](https://github.com/flexa-script) code. Inspired by the look and feel of VSCode, it provides a clean and intuitive developer experience.

## 🚀 Features

- 🖊️ Code editor with syntax highlighting
- 🖥️ Integrated interactive terminal (VSCode-style)
- ▶️ Run Flexa code securely via Docker sandboxing
- 🔒 Backend isolation for safe execution
- 📄 Quick link to the official documentation

## 📁 Project Structure

```
flexa-web-ide/
├── public/                # Static public assets
├── src/                   # React source code
│   ├── components/        # Reusable UI components
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🧪 Requirements

- Node.js 18+
- Docker (used to run the interpreter securely)

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/flexa-script/flexa-web-ide.git
cd flexa-web-ide/app

# Install dependencies
npm install

# Start the development server
npm run dev

# Now go to server
cd flexa-web-ide/server

# Install dependencies
npm install

# Start the development server
node src/server.js
```

## 📌 Roadmap

- [ ] Multi-file support
- [ ] Customizable themes
- [ ] Execution history
- [ ] Authentication and saved projects

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
