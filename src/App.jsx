import React, { useEffect, useRef, useState } from "react";
import AsciiArt from "./components/AsciiArt";
import Footer from "./components/Footer";
import { parseCommand } from "./utils/commandController";
import { taskManager } from "./utils/taskManager";
import { print } from "./utils/Print";
import quotes from "./utils/quotes.json";
import { getRandomQuote } from "./utils/getRandomQuote";
import AsciiArtRenderer from "./components/AsciiArtRenderer";
import { logoAscii } from "./utils/logoAscii";

const PREFIX = "cmdtask:~$";

function getHelpText() {
  return `Here's a list of available commands:
  add "task name" [--high|--medium|--low]   Add a task
  list                                     List tasks
  delete <taskID>                          Delete a task
  done <taskID>                            Mark task as done
  clear                                    Clear the terminal
  purge                                    Delete all tasks.
  help                                     Show help
  about                                    Know more about cmdtask.
  indexeddb                          Know more indexeddb.
  coffee                                   ???
  ping                                     ???`;
}

function getAboutText() {
  return `cmdtask is a minimalist, terminal-style to-do app built for developers and keyboard-focused users. a keyboard-native task manager that speaks in commands, not clicks.  no UI clutter, just fast, efficient productivity from your fingertips

# How it works
cmdtask uses your browser's built-in IndexedDB database to save your tasks directly on your device. This means your to-do list is stored persistently and privately — no data is sent to any server or cloud service.

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
}

function getIndexedDbInfoText() {
  return `About your data (IndexedDB)

cmdtask stores your tasks using a browser feature called IndexedDB.

IndexedDB is a built-in database system that runs entirely inside your browser. It lets cmdtask save your tasks directly on your device — no internet connection, no accounts, no data sent to any server.

This means:
- Your tasks stay saved even if you close the tab or restart your computer
- Everything is private and offline
- You won’t lose tasks unless you delete them or clear your browser/site data

If you're familiar with dev tools, you can even inspect the data manually via your browser's Application tab → IndexedDB.

TL;DR: IndexedDB is like a local hard drive for web apps — cmdtask uses it to store your tasks, quietly and securely, under the hood.`;
}

function formatTask(task) {
  const status = task.done ? "[x]" : "[ ]";
  const priority = task.priority.padEnd(6);
  const line = `${status} [${priority}] ${task.id} - ${task.taskName}`;

  return task.done ? print.complete(line) : line;
}

const App = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [confirm, setConfirm] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIdx =
          historyIdx === null
            ? commandHistory.length - 1
            : Math.max(0, historyIdx - 1);
        setInput(commandHistory[newIdx]);
        setHistoryIdx(newIdx);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIdx !== null) {
        const newIdx = historyIdx + 1;
        if (newIdx >= commandHistory.length) {
          setInput("");
          setHistoryIdx(null);
        } else {
          setInput(commandHistory[newIdx]);
          setHistoryIdx(newIdx);
        }
      }
    }
  };

  useEffect(() => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();

    if (confirm) {
      if (trimmedInput === "y" || trimmedInput === "yes") {
        const { onConfirm } = confirm;
        const result = await onConfirm();
        setHistory((prev) => [...prev, `$ ${input}`, result]);
      } else {
        setHistory((prev) => [
          ...prev,
          `$ ${input}`,
          print.muted("Action cancelled."),
        ]);
      }

      setConfirm(null);
      setInput("");
      return;
    }

    const commandObj = parseCommand(trimmedInput);
    let output = "";

    switch (commandObj.action) {
      case "add":
        await taskManager.addTask(commandObj.payload);
        output = print.success(
          `Task added: "${commandObj.payload.taskName}" [${commandObj.payload.priority}]`
        );
        break;

      case "list":
        const tasks = await taskManager.getAllTasks();
        output = tasks.length ? (
          <div className="flex flex-col gap-1 font-mono">
            {tasks.map((t, i) => (
              <div key={i}>{formatTask(t)}</div>
            ))}
          </div>
        ) : (
          print.muted("No tasks found.")
        );
        break;

      case "delete": {
        const taskId = commandObj.payload.id;
        const task = await taskManager.getTaskById(taskId);
        if (!task) {
          output = print.muted("Invalid task ID. Double-check and try again.");
          break;
        }

        setConfirm({
          action: "delete",
          onConfirm: async () => {
            await taskManager.deleteTask(taskId);
            return print.success(`Task deleted: ${taskId}`);
          },
        });

        output = print.warn(
          `Are you sure you want to delete "${task.taskName}" (${taskId})? (y/n)`
        );
        break;
      }

      case "done": {
        const taskId = commandObj.payload.id;
        const task = await taskManager.getTaskById(taskId);
        if (!task) {
          output = print.muted("Invalid task ID. Double-check and try again.");
          break;
        }

        await taskManager.markAsDone(taskId);
        output = print.success(`Task marked as done: ${taskId}`);
        break;
      }

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "purge":
        setConfirm({
          action: "purge",
          onConfirm: async () => {
            await taskManager.clearAllTasks();
            return print.success("All tasks deleted from the database.");
          },
        });
        output = print.danger(
          "This will permanently delete all tasks. Proceed? (y/n)"
        );
        break;

      case "reset":
        await taskManager.clearAllTasks();
        output = print.success("All tasks cleared.");
        break;

      case "help":
        output = <pre className="whitespace-pre-wrap">{getHelpText()}</pre>;
        break;

      case "about":
        output = <pre className="whitespace-pre-wrap">{getAboutText()}</pre>;
        break;

      case "indexeddb":
        output = (
          <pre className="whitespace-pre-wrap">{getIndexedDbInfoText()}</pre>
        );
        break;

      case "invalid":
        output = print.danger(
          `Unknown command '${commandObj.payload.input}'. Type 'help' for a list of commands.`
        );
        break;

      case "ping":
        output = print.info(`pong!`);
        break;

      case "date":
        output = print.info(
          `It's ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} today.`
        );
        break;

      case "coffee":
        output = print.coffee(getRandomQuote(quotes.coffeeQuotes));
        break;
    }

    setHistory((prev) => [...prev, `${PREFIX} ${input}`, output]);
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIdx(null);
    setInput("");
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-start justify-start gap-2 p-5 font-light font-mono text-sm bg-black text-white"
      ref={containerRef}
    >
      <div className="w-full mb-2">
        <AsciiArtRenderer art={logoAscii} />
        <div className="py-2  space-y-2 text-base">
          <p className="max-w-1/2">
            <span className="font-bold">cmdtask </span>
            <span className="text-sm">(pronounced Command-Task) </span>
            is a terminal-style to do application built for makers, developers,
            and keyboard-first thinkers. It brings the power of the command line
            to your daily workflow—no mouse, no distractions, just fast,
            efficient task handling through intuitive commands.
          </p>
          <p>
            Type <span className="font-bold">help</span> to get started or{" "}
            <span className="font-bold">about</span> to learn more about cmdtask
          </p>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1">
        {history.map((line, idx) => (
          <div key={idx} className="mb-3 whitespace-pre-wrap">
            {typeof line === "string" ? <pre>{line}</pre> : line}
          </div>
        ))}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full mt-4"
        >
          <span className="">{PREFIX}</span>
          <input
            ref={inputRef}
            autoFocus
            onBlur={() => inputRef.current?.focus()}
            type="text"
            className="bg-transparent border-none outline-none w-full text-white placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default App;
