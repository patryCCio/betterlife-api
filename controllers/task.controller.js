import { Task } from "../models/task.model.js";

// 🔧 helper – budowanie drzewa
const buildTree = (tasks, parentId = null) => {
  return tasks
    .filter(t => t.parentId === parentId)
    .map(t => ({
      ...t._doc,
      subtask: buildTree(tasks, t.uuid)
    }));
};

// 🔧 helper – znajdź wszystkie dzieci (do delete / toggle)
const getAllChildren = (tasks, parentId) => {
  let result = [];

  const find = (pid) => {
    const children = tasks.filter(t => t.parentId === pid);
    for (let child of children) {
      result.push(child.uuid);
      find(child.uuid);
    }
  };

  find(parentId);
  return result;
};


// 📥 GET TODOS (tree + filter + sort + pagination rootów)
export const getTodos = async (req, res) => {
  const {
    btnState = "all",
    sortBy = "none",
    page = 1,
    limit = 10
  } = req.query;

  try {
    let filter = {};

    if (btnState === "done") filter.done = true;
    if (btnState === "undone") filter.done = false;

    const tasks = await Task.find(filter);

    // 🧠 sort tylko rootów
    const sortMap = {
      createdDesc: (a, b) => new Date(b.deadline || 0) - new Date(a.deadline || 0),
      createdAsc: (a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0),
      priorityDesc: (a, b) => b.priority - a.priority,
      priorityAsc: (a, b) => a.priority - b.priority,
    };

    let tree = buildTree(tasks);

    if (sortMap[sortBy]) {
      tree.sort(sortMap[sortBy]);
    }

    // 📄 paginacja rootów
    const start = (page - 1) * limit;
    const paginated = tree.slice(start, start + Number(limit));

    res.json(paginated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ➕ ADD TASK / SUBTASK
export const addTask = async (req, res) => {
  try {
    const { title, priority, deadline, parentId = null } = req.body;

    const task = await Task.create({
      uuid: Date.now().toString(),
      title,
      priority,
      deadline: deadline || null,
      done: false,
      parentId
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✏️ EDIT
export const updateTask = async (req, res) => {
  try {
    const { uuid } = req.params;

    const updated = await Task.findOneAndUpdate(
      { uuid },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ TOGGLE DONE (+ wszystkie dzieci)
export const toggleDone = async (req, res) => {
  try {
    const { uuid } = req.params;

    const allTasks = await Task.find();
    const task = allTasks.find(t => t.uuid === uuid);

    const newDone = !task.done;

    const childrenIds = getAllChildren(allTasks, uuid);

    await Task.updateMany(
      { uuid: { $in: [uuid, ...childrenIds] } },
      { done: newDone }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🗑️ DELETE (+ całe poddrzewo)
export const deleteTask = async (req, res) => {
  try {
    const { uuid } = req.params;

    const allTasks = await Task.find();
    const childrenIds = getAllChildren(allTasks, uuid);

    await Task.deleteMany({
      uuid: { $in: [uuid, ...childrenIds] }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};