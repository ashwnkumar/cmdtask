const priorityMap = {
    "--high": "high",
    "--medium": "medium",
    "--low": "low",
};

const getPriorityFlag = (args) => args.find((arg) => arg.startsWith("--"));
const isValidPriorityFlag = (flag) => Object.hasOwn(priorityMap, flag);

export const parseCommand = (input) => {
    const [command, ...args] = input.trim().split(" ");

    const lowerCommand = command.toLowerCase();
   

    switch (lowerCommand) {
        case "add": {
            const priorityFlag = getPriorityFlag(args);
            const taskName = args.filter(arg => !arg.startsWith("--")).join(" ").trim();

            if (priorityFlag && !isValidPriorityFlag(priorityFlag)) {
                return {
                    action: "error",
                    payload: {
                        message: `Invalid priority flag '${priorityFlag}'. Allowed: --high, --medium, --low.`,
                    },
                };
            }

            if (!taskName) {
                return {
                    action: "error",
                    payload: {
                        message: 'Task name cannot be empty. Usage: add "task name" [--priority]',
                    },
                };
            }

            const priority = priorityMap[priorityFlag] || "low";
            return { action: "add", payload: { taskName, priority } };
        }

        case "list": {
            const [firstArg] = args;

            if (["done", "pending"].includes(firstArg)) {
                return { action: "list", payload: { status: firstArg } };
            }

            const priorityFlag = getPriorityFlag(args);
            if (isValidPriorityFlag(priorityFlag)) {
                return {
                    action: "list",
                    payload: { priority: priorityMap[priorityFlag] },
                };
            }

            return { action: "list", payload: {} };
        }

        case "delete":
        case "done": {
            const [id] = args;
            if (!id) {
                return {
                    action: "error",
                    payload: { message: `Task ID cannot be empty. Usage: ${lowerCommand} <taskID>` },
                };
            }

            return {
                action: lowerCommand,
                payload: lowerCommand === "done" ? { id, status: "done" } : { id },
            };
        }

        // Simple one-word commands
        case "clear":
        case "help":
        case "about":
        case "indexeddb":
        case "purge":
        case "ping":
        case "404":
        case "motivate":
        case "hack":
        case "date":
        case "coffee":
        case "refresh":
        case "wipe-db":
            return { action: lowerCommand };

        default:
            return { action: "invalid", payload: { input } };
    }
};
