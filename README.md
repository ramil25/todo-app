# Todo App

A modern, responsive todo application built with Next.js, featuring due date notifications and localStorage persistence.

## 🌟 Features

- ✅ Create, edit, delete, and complete todos
- 📅 Set due dates for tasks
- 🔔 Due date notifications (items due within 24 hours)
- 💾 Persistent storage using localStorage
- 📱 Responsive design with Tailwind CSS
- ⚡ Static site deployment ready

## 🚀 Live Demo

The application is deployed on GitHub Pages: **[https://ramil25.github.io/todo-app/](https://ramil25.github.io/todo-app/)**

## 🛠️ Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ramil25/todo-app.git
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

This will create an optimized static build in the `out` directory, ready for deployment.

## 📦 Deployment

The app is configured for static export and automatically deploys to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

### Manual Deployment

You can also deploy the static build to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the contents of the `out` directory

## 🧪 Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: localStorage (client-side)
- **Deployment**: GitHub Pages with GitHub Actions

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main todo page
│   └── globals.css         # Global styles
├── components/
│   ├── TodoForm.tsx        # Add new todo form
│   ├── TodoItem.tsx        # Individual todo item
│   └── NotificationPanel.tsx # Due date notifications
└── lib/
    ├── localStorage.ts     # Client-side data persistence
    └── api.ts             # API abstraction layer
```

## ✨ Usage

1. **Add a Todo**: Fill in the title, description (optional), and due date (optional) in the form
2. **Complete a Todo**: Click the circle button to mark as complete
3. **Edit a Todo**: Click the edit button to modify details
4. **Delete a Todo**: Click the trash button to remove
5. **Due Date Notifications**: Items due within 24 hours appear in the notification panel

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
