const priorityMap = {
    "--high": "high",
    "--medium": "medium",
    "--low": "low",
}

export const parseCommand = (input) => {
    const [command, ...args] = input.split(" ");
    switch (command.toLowerCase()) {
        case "add":
            {
                const priorityFlag = args.find((arg) => arg.startsWith("--"));
                const priority = priorityMap[priorityFlag] || "low";
                const taskName = args.filter((arg) => !arg.startsWith("--")).join(" ");
                return { action: "add", payload: { taskName, priority } };
            }
        case "list":
            return { action: "list" };

        case "delete":
            {
                const taskName = args.filter((arg) => !arg.startsWith("--")).join(" ");
                return { action: "delete", payload: { id: args[0], taskName } }
            }

        case "done":
            return { action: "done", payload: { id: args[0] } }

        case "clear":
            return { action: "clear" }

        case "help":
            return { action: "help" }

        case "about":
            return { action: "about" }

        case "indexeddb":
            return { action: "indexeddb" }

        case "purge":
            return { action: "purge" };

        case "ping":
            return { action: "ping" };

        case "date":
            return { action: "date" };

        case "coffee":
            return { action: "coffee" };

        default:
            return { action: "invalid", payload: { input } }
    }
}