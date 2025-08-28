export const getHelpText = () => `Here's a list of available commands:
  add "task name" [--high|--medium|--low]   Add a task
  list                                      List tasks
  list done                                 List completed tasks
  list pending                              List pending tasks
  list [--high|--medium|--low]              List tasks by priority
  delete <taskID>                           Delete a task
  done <taskID>                             Mark task as done
  clear                                     Clear the terminal
  purge                                     Delete all tasks.
  help                                      Show help
  refresh                                   Refresh the page.
  wipe-db                                   Delete database.
  about                                     Know more about cmdtask.
  indexeddb                                 Know more indexeddb.
  \u2191 / \u2193                                     Navigate previous commands
  coffee                                    ???
  404                                       ???
  motivate                                  ???
  hack                                      ???
  ping                                      ???`;

export const getAboutText = () => `cmdtask is a minimalist, terminal-style to-do app built for developers and keyboard-focused users. a keyboard-native task manager that speaks in commands, not clicks. no UI clutter, just fast, efficient productivity from your fingertips

# How it works
cmdtask uses your browser's built-in IndexedDB database to save your tasks directly on your device. This means your to-do list is stored persistently and privately — no data is sent to any server or cloud service.
Run the command 'indexeddb' for more info

Your tasks will remain saved even if you close the tab, restart your computer, or disconnect from the internet. They’re only removed if you delete them manually or clear your browser data.

# What you can do
- Add tasks with customizable priority levels
- List all your tasks quickly
- Mark tasks as done or delete them
- Purge all tasks when needed
- Navigate and manage everything entirely from your keyboard

# Privacy & Storage
Since cmdtask stores data locally in your browser, your tasks are private and secure. Switching browsers or clearing your browser data will remove your saved tasks. No external access or syncing is performed.

Type 'help' to get started and see available commands.`;

export const getIndexedDbInfoText = () => `About your data (IndexedDB)

cmdtask stores your tasks using a browser feature called IndexedDB.

IndexedDB is a built-in database system that runs entirely inside your browser. It lets cmdtask save your tasks directly on your device — no internet connection, no accounts, no data sent to any server.

This means:
- Your tasks stay saved even if you close the tab or restart your computer
- Everything is private and offline
- You won’t lose tasks unless you delete them or clear your browser/site data

If you're familiar with dev tools, you can even inspect the data manually via your browser's Application tab → IndexedDB.

TL;DR: IndexedDB is like a local hard drive for web apps — cmdtask uses it to store your tasks, quietly and securely, under the hood.`;
