// import { print } from "./Print";
// import { taskManager } from "./taskManager";
// import { formatTask } from "./formatTask";
// import { getHelpText, getAboutText, getIndexedDbInfoText } from "./staticText";
// import { getRandomQuote } from "./getRandomQuote";

import { formatTask } from "../App";
import { getRandomQuote } from "./getRandomQuote";
import { print } from "./Print";
import { getAboutText, getHelpText, getIndexedDbInfoText } from "./staticText";
import quotes from "./quotes.json";
import { taskManager } from "./taskManager";

const PREFIX = "@cmdtask:~$";

export async function executeCommand({ commandObj, input }) {
    let output = "";
    let confirm = null;
    const taskId = commandObj.payload?.id?.trim?.();

    switch (commandObj.action) {
        case "add":
            await taskManager.addTask(commandObj.payload);
            output = print.success(
                `Task added: "${commandObj.payload.taskName}" [${commandObj.payload.priority}]`
            );
            break;

        case "list": {
            let tasks = [];

            if (commandObj.payload?.priority) {
                tasks = await taskManager.getTasksByPriority(commandObj.payload.priority);
            } else if (commandObj.payload?.status) {
                tasks = await taskManager.getTasksByStatus(commandObj.payload.status);
            } else {
                tasks = await taskManager.getAllTasks();
            }

            output = tasks.length
                ? (
                    <div className="flex flex-col gap-1 font-mono">
                        {tasks.map((t, i) => (
                            <div key={i}>{formatTask(t)}</div>
                        ))}
                    </div>
                )
                : print.muted("No tasks found.");
            break;
        }

        case "wipe-db":
            confirm = {
                action: "wipe-db",
                phrase: "delete-cmdtask-database",
                onConfirm: async () => {
                    await taskManager.wipeDb();
                    return print.success("Database wiped. Run 'refresh' to refresh the page and reinitialize.");
                },
            };

            output = print.danger(
                `This will permanently delete the entire cmdtask database, including all tasks and settings. Type "delete-cmdtask-database" to confirm.`
            );
            break;

        case "refresh":
            window.location.reload();
            return { output: null, confirm: null };

        case "delete": {
            const task = await taskManager.getTaskById(taskId);
            if (!task) {
                output = print.warn("Invalid task ID. Double-check and try again.");
                break;
            }

            confirm = {
                action: "delete",
                onConfirm: async () => {
                    await taskManager.deleteTask(taskId);
                    return print.success(`Task deleted: ${taskId}`);
                },
            };

            output = print.warn(
                `Are you sure you want to delete "${task.taskName}" (${taskId})? (y/n)`
            );
            break;
        }

        case "done": {
            const task = await taskManager.getTaskById(taskId);
            if (!task) {
                output = print.warn("Invalid task ID. Double-check and try again.");
                break;
            }

            await taskManager.markAsDone(taskId, commandObj.payload.status);
            output = print.success(`Task marked as done: ${taskId}`);
            break;
        }

        case "clear":
            // Caller should handle clearing state
            return { output: null, clear: true };

        case "purge": {
            const tasks = await taskManager.getAllTasks();
            if (!tasks.length) {
                output = print.muted("No tasks to purge.");
                break;
            }

            confirm = {
                action: "purge",
                onConfirm: async () => {
                    await taskManager.clearAllTasks();
                    return print.success("All tasks deleted from the database.");
                },
            };

            output = print.danger("This will permanently delete all tasks. Proceed? (y/n)");
            break;
        }

        case "help":
            output = <pre className="whitespace-pre-wrap">{getHelpText()}</pre>;
            break;

        case "about":
            output = <pre className="whitespace-pre-wrap">{getAboutText()}</pre>;
            break;

        case "indexeddb":
            output = <pre className="whitespace-pre-wrap">{getIndexedDbInfoText()}</pre>;
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

        case "404":
            output = print.info(getRandomQuote(quotes.notFoundQuotes));
            break;

        case "motivate":
            output = print.info(getRandomQuote(quotes.motivationQuotes));
            break;

        case "hack":
            output = print.danger(getRandomQuote(quotes.hackermanQuotes));
            break;

        case "error":
            output = print.danger(commandObj.payload.message);
            break;

        case "invalid":
            output = print.danger(
                `Unknown command '${commandObj.payload.input}'. Type 'help' for a list of commands.`
            );
            break;
    }

    return { output, confirm };
}

export default executeCommand;