# cmdtask

> A terminal-inspired todo list for developers and keyboard-first thinkers. Because sometimes the best UI is no UI at all.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://cmd-task.web.app/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38bdf8)](https://tailwindcss.com/)

**[🚀 Try it live](https://cmd-task.web.app/)**

## What is this?

cmdtask (pronounced "Command-Task") is an unconventional todo list built for people who live in the terminal. No fancy buttons, no drag-and-drop, no mouse required — just you, your keyboard, and a command-line interface that actually makes task management fun.

Born from a weekend project fueled by caffeine and a desire to build something different, cmdtask brings the power and simplicity of CLI tools to your daily workflow. If you've ever felt more productive in a terminal than in a GUI, this is for you.

## Why though?

Because clicking through menus is overrated. Because keyboard shortcuts are faster than mouse movements. Because sometimes you just want to type `add "fix that bug" --high` and move on with your life.

Plus, it looks cool. And that matters.

## Features

- **Pure keyboard navigation** — Your mouse can take a break
- **Command-line interface** — Familiar syntax for developers
- **Priority management** — Flag tasks as high, medium, or low priority
- **Task filtering** — List by status or priority
- **Command history** — Arrow keys to navigate previous commands
- **Local storage** — Your tasks persist using IndexedDB
- **ASCII art** — Because why not?
- **Motivational quotes** — For when you need that extra push
- **Zero distractions** — Just you and your tasks

## Commands

```bash
# Add tasks
add "task name"                    # Add a task (default: low priority)
add "urgent task" --high           # Add with high priority
add "can wait" --low               # Add with low priority

# List tasks
list                               # Show all tasks
list done                          # Show completed tasks
list pending                       # Show pending tasks
list --high                        # Show high priority tasks

# Manage tasks
done <taskID>                      # Mark task as complete
delete <taskID>                    # Delete a task

# Utility
help                               # Show available commands
about                              # Learn more about cmdtask
motivate                           # Get a random motivational quote
clear                              # Clear the terminal
refresh                            # Reload the app
ping                               # Check if the app is alive

# Advanced
indexeddb                          # View IndexedDB info
purge                              # Delete all completed tasks
wipe-db                            # Clear all data (requires confirmation)
```

## Tech Stack

- **React 19.1.0** — UI library
- **Vite 7.0.4** — Build tool and dev server
- **TailwindCSS 4.1.11** — Utility-first styling
- **IndexedDB** — Client-side storage
- **Firebase Hosting** — Deployment platform

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/cmdtask.git
cd cmdtask

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
cmdtask/
├── src/
│   ├── components/       # React components
│   ├── utils/           # Command parser, task manager, storage
│   ├── App.jsx          # Main application
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## How It Works

1. **Command Parsing** — Input is parsed into structured commands
2. **Task Management** — Tasks are stored in IndexedDB with unique IDs
3. **Command Execution** — Commands trigger CRUD operations
4. **Terminal UI** — History is rendered as a scrollable terminal output

## Contributing

This was a fun weekend project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new commands
- Improve the UI/UX
- Add features
- Fix typos (there are probably many)

## License

MIT — Do whatever you want with it.

## Acknowledgments

Built with ☕ and ⌨️ during a weekend of procrastination and inspiration.

---

**[Try cmdtask now →](https://cmd-task.web.app/)**

_For keyboard warriors, by a keyboard warrior._
