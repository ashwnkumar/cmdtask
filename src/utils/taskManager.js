const DB_NAME = 'cmdtask';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

const openDb = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('priority', 'priority', { unique: false });
                store.createIndex('status', 'status', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

const runTxn = async (mode, cb) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const txn = db.transaction(STORE_NAME, mode);
        const store = txn.objectStore(STORE_NAME);
        const result = cb(store);

        txn.oncomplete = () => resolve(result);
        txn.onerror = () => reject(txn.error);
    });
};

const generateId = () => {
    const suffix = (Date.now() % 1000).toString().padStart(3, '0');
    return `tsk-${suffix}`;
};

const sortTasks = (tasks) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return tasks.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'done' ? 1 : -1;
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.createdAt - b.createdAt;
    });
};

const getAllFromIndex = (indexName, value) =>
    runTxn('readonly', (store) =>
        new Promise((resolve, reject) => {
            const req = store.index(indexName).getAll(value);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        })
    );

export const taskManager = {
    async addTask({ taskName, priority }) {
        const task = {
            id: generateId(),
            taskName,
            priority,
            status: 'pending',
            createdAt: Date.now(),
        };
        return runTxn('readwrite', (store) => store.add(task));
    },

    async getAllTasks() {
        return runTxn('readonly', (store) =>
            new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(sortTasks(req.result));
                req.onerror = () => reject(req.error);
            })
        );
    },

    async getTasksByPriority(priority) {
        const tasks = await getAllFromIndex('priority', priority.toLowerCase());
        return sortTasks(tasks);
    },

    async getTasksByStatus(status) {
        const tasks = await getAllFromIndex('status', status);
        return sortTasks(tasks);
    },

    async getTaskById(id) {
        return runTxn('readonly', (store) =>
            new Promise((resolve, reject) => {
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            })
        );
    },

    async deleteTask(id) {
        return runTxn('readwrite', (store) => store.delete(id));
    },

    async markAsDone(id, status) {
        const task = await this.getTaskById(id);
        if (task) {
            task.status = status;
            return runTxn('readwrite', (store) => store.put(task));
        }
    },

    async clearAllTasks() {
        return runTxn('readwrite', (store) => store.clear());
    },

    async wipeDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(DB_NAME);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            request.onblocked = () => {
                console.warn('Database deletion is blocked. Please close all other tabs.');
                reject(new Error('Deletion blocked'));
            };
        });
    },
};
