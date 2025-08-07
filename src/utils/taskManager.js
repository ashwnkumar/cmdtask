const DB_NAME = 'cmdtask'
const DB_VERSION = 1
const STORE_NAME = 'tasks'

const openDb = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (e) => {
            const db = e.target.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("priority", "priority", { unique: false })
                store.createIndex("done", "done", { unique: false })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

const runTxn = async (mode, cb) => {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const txn = db.transaction(STORE_NAME, mode)
        const store = txn.objectStore(STORE_NAME)
        const result = cb(store);

        txn.oncomplete = () => resolve(result)
        txn.onerror = () => reject(txn.error)
    })
}

const generateId = () => {
    const suffix = (Date.now() % 1000).toString().padStart(3, "0");
    return `tsk-${suffix}`;
};


export const taskManager = {
    async addTask({ taskName, priority }) {
        const task = {
            id: generateId(),
            taskName,
            priority,
            done: false,
            createdAt: Date.now()
        };

        await runTxn("readwrite", (store) => store.add(task));
    },

    async getAllTasks() {
        return await runTxn("readonly", (store) => {
            return new Promise((resolve, reject) => {
                const request = store.getAll();

                request.onsuccess = () => {
                    const tasks = request.result;
                    const priorityOrder = { high: 1, medium: 2, low: 3 };

                    tasks.sort((a, b) => {
                        if (a.done !== b.done) return a.done ? 1 : -1;
                        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                            return priorityOrder[a.priority] - priorityOrder[b.priority];
                        }
                        return a.createdAt - b.createdAt;
                    })

                    resolve(tasks)
                }

                request.onerror = () => reject(request.error)
            })
        })
    },

    async getTaskById(id) {
        return await runTxn("readonly", (store) => {
            return new Promise((resolve, reject) => {
                const req = store.get(id)
                req.onsuccess = () => resolve(req.result)
                req.onerror = () => reject(req.error);

            })
        })
    },

    async deleteTask(id) {
        await runTxn("readwrite", (store) => store.delete(id))
    },

    async markAsDone(id) {
        await runTxn("readwrite", (store) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const task = getRequest.result;
                if (task) {
                    task.done = true
                    store.put(task)
                }
            }
        })
    },

    async clearAllTasks() {
        await runTxn("readwrite", (store) => store.clear())
    },

}