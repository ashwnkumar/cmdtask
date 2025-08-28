import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import { parseCommand } from "./utils/commandController";
import { print } from "./utils/Print";
import AsciiArtRenderer from "./components/AsciiArtRenderer";
import { logoAscii } from "./utils/logoAscii";
import executeCommand from "./utils/CommandExecutor";

const PREFIX = "@cmdtask:~$";

export function formatTask(task) {
  const status = task.status === "done" ? "[x]" : "[ ]";
  const priority = task.priority.padEnd(6);
  const line = `${status} [${priority}] ${task.id} - ${task.taskName}`;

  return task.status === "done" ? print.complete(line) : line;

}

const App = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [confirm, setConfirm] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(null);

  const handleKeyDown = useCallback((e) => {
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
  }, [commandHistory, historyIdx]);


  useEffect(() => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (confirm) {
      const userInput = trimmedInput;

      if (confirm.phrase) {
        if (userInput === confirm.phrase) {
          const result = await confirm.onConfirm();
          setHistory((prev) => [...prev, `${PREFIX} ${input}`, result]);
        } else {
          setHistory((prev) => [
            ...prev,
            `${PREFIX} ${input}`,
            print.muted("Action cancelled. Phrase did not match."),
          ]);
        }
      } else if (userInput === "y" || userInput === "yes") {
        const result = await confirm.onConfirm();
        setHistory((prev) => [...prev, `${PREFIX} ${input}`, result]);
      } else {
        setHistory((prev) => [
          ...prev,
          `${PREFIX} ${input}`,
          print.muted("Action cancelled."),
        ]);
      }

      setConfirm(null);
      setInput("");
      return;
    }

    const commandObj = parseCommand(trimmedInput)
    const { output, confirm: newConfirm, clear } = await executeCommand({ commandObj, input });

    if (clear) {
      setHistory([]);
      setInput("");
      return;
    }

    if (newConfirm) setConfirm(newConfirm);

    setHistory((prev) => [...prev, `${PREFIX} ${input}`, output]);
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIdx(null);
    setInput("");

  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col gap-2 px-4 py-6 sm:px-6 md:px-8 lg:px-12 font-light font-mono text-sm bg-dark text-light overflow-hidden"
    >

      <div className="w-full">
        <AsciiArtRenderer art={logoAscii} />
        <div className="py-2  space-y-2 text-sm md:text-base lg:max-w-1/2 border-b-2 border-dashed">
          <p className=" " >
            <span className="font-bold">cmdtask </span>
            <span className="text-xs md:text-sm">(pronounced Command-Task) </span>
            is a terminal inspired to do application built for developers
            and keyboard-first thinkers. It brings the power of the command line
            to your daily workflow — no mouse, no distractions, just fast,
            efficient task handling through intuitive commands.
          </p>
          <p className="">
            Type <span className="font-bold">help</span> to get started or{" "}
            <span className="font-bold">about</span> to learn more about cmdtask
          </p>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1 max-h-full pr-1">

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
            onChange={(e) => setInput(e.target.value.toLowerCase())}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default App;
