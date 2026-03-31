import { Task } from "../models/task.model.js";

// 🔧 helper – dzieci
const getAllChildren = (tasks, parentId) => {
  let result = [];

  const find = (pid) => {
    const children = tasks.filter((t) => t.parentId === pid);
    for (let child of children) {
      result.push(child.uuid);
      find(child.uuid);
    }
  };

  find(parentId);
  return result;
};

// 📥 GET TODOS
export const getTodos = async (req, res) => {
  const { user_uuid } = req.params;
  const {
    btnState = "all",
    sortBy = "none",
    page = 1,
    limit = 5,
    subtaskTodo,
  } = req.query;

  try {
    let filter = { user_uuid };

    if (btnState === "done") filter.done = true;
    if (btnState === "undone") filter.done = false;

    let subtaskFilter = {};

    if (subtaskTodo === "done") subtaskFilter.done = true;
    if (subtaskTodo === "undone") subtaskFilter.done = false;

    const sortOptions = {
      createdAsc: { createdAt: 1 },
      createdDesc: { createdAt: -1 },
      deadlineAsc: { deadline: 1 },
      deadlineDesc: { deadline: -1 },
      priorityAsc: { priority: -1 },
      priorityDesc: { priority: 1 },
    };

    const skip = (page - 1) * limit;

    // rooty
    const roots = await Task.find({
      ...filter,
      parentId: null,
    })
      .sort(sortOptions[sortBy] || {})
      .skip(skip)
      .limit(Number(limit));

    const rootIds = roots.map((r) => r.uuid);

    // rekurencja
    async function getAllDescendants(parentIds) {
      const children = await Task.find({
        parentId: { $in: parentIds },
        user_uuid,
        ...subtaskFilter,
      });

      if (!children.length) return [];

      const childIds = children.map((c) => c.uuid);
      const deeper = await getAllDescendants(childIds);

      return [...children, ...deeper];
    }

    const descendants = await getAllDescendants(rootIds);
    const allTasks = [...roots, ...descendants];

    // 🌳 budowanie drzewa
    const map = {};
    const tree = [];

    allTasks.forEach((task) => {
      map[task.uuid] = {
        ...task.toObject(),
        subtask: [],
      };
    });

    allTasks.forEach((task) => {
      if (task.parentId) {
        if (map[task.parentId]) {
          map[task.parentId].subtask.push(map[task.uuid]);
        }
      } else {
        tree.push(map[task.uuid]);
      }
    });

    const total = await Task.countDocuments({
      ...filter,
      parentId: null,
    });

    res.json({ tree, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ ADD
export const addTask = async (req, res) => {
  try {
    const { user_uuid } = req.params;
    const { title, priority, deadline, parentId = null } = req.body;

    const task = await Task.create({
      uuid: Date.now().toString(),
      title,
      priority,
      deadline: deadline || null,
      done: false,
      parentId,
      user_uuid,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE
export const updateTask = async (req, res) => {
  try {
    const { uuid, user_uuid } = req.params;

    const updated = await Task.findOneAndUpdate({ uuid, user_uuid }, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TOGGLE
export const toggleDone = async (req, res) => {
  try {
    const { uuid, user_uuid } = req.params;

    const allTasks = await Task.find({ user_uuid });
    const task = allTasks.find((t) => t.uuid === uuid);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newDone = !task.done;
    const childrenIds = getAllChildren(allTasks, uuid);

    await Task.updateMany(
      {
        uuid: { $in: [uuid, ...childrenIds] },
        user_uuid,
      },
      { done: newDone },
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ DELETE
export const deleteTask = async (req, res) => {
  try {
    const { uuid, user_uuid } = req.params;

    const allTasks = await Task.find({ user_uuid });
    const childrenIds = getAllChildren(allTasks, uuid);

    await Task.deleteMany({
      uuid: { $in: [uuid, ...childrenIds] },
      user_uuid,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
