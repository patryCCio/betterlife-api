import { Task } from "../models/task.model.js";

// 🔧 helper – budowanie drzewa
const buildTree = (tasks, parentId = null) => {
  return tasks
    .filter((t) => t.parentId === parentId)
    .map((t) => ({
      ...t._doc,
      subtask: buildTree(tasks, t.uuid),
    }));
};

// 🔧 helper – znajdź wszystkie dzieci (do delete / toggle)
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

export const getTodos = async (req, res) => {
  const { btnState = "all", sortBy = "none", page = 1, limit = 5 } = req.query;

  try {
    let filter = {};

    if (btnState === "done") filter.done = true;
    if (btnState === "undone") filter.done = false;

    const sortOptions = {
      createdDesc: { deadline: -1 },
      createdAsc: { deadline: 1 },
      priorityDesc: { priority: -1 },
      priorityAsc: { priority: 1 },
    };

    const skip = (page - 1) * limit;

    // ✅ 1. rooty (parentId = null)
    const roots = await Task.find({ ...filter, parentId: null })
      .sort(sortOptions[sortBy] || {})
      .skip(skip)
      .limit(Number(limit));

    const rootIds = roots.map((r) => r.uuid);

    // ✅ 2. rekurencja po uuid
    async function getAllDescendants(parentIds) {
      const children = await Task.find({
        parentId: { $in: parentIds },
      });

      if (!children.length) return [];

      const childIds = children.map((c) => c.uuid);

      const deeper = await getAllDescendants(childIds);

      return [...children, ...deeper];
    }

    const descendants = await getAllDescendants(rootIds);

    const allTasks = [...roots, ...descendants];

    // ✅ 3. buildTree na uuid
    function buildTree(tasks) {
      const map = {};
      const tree = [];

      tasks.forEach((task) => {
        map[task.uuid] = {
          ...task.toObject(),
          subtask: [],
        };
      });

      tasks.forEach((task) => {
        if (task.parentId) {
          map[task.parentId]?.subtask.push(map[task.uuid]);
        } else {
          tree.push(map[task.uuid]);
        }
      });

      return tree;
    }

    const tree = buildTree(allTasks);

    const total = await Task.countDocuments({ ...filter, parentId: null });

    console.log(total);

    res.json(tree);
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
      parentId,
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

    const updated = await Task.findOneAndUpdate({ uuid }, req.body, {
      new: true,
    });

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
    const task = allTasks.find((t) => t.uuid === uuid);

    const newDone = !task.done;

    const childrenIds = getAllChildren(allTasks, uuid);

    await Task.updateMany(
      { uuid: { $in: [uuid, ...childrenIds] } },
      { done: newDone },
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
      uuid: { $in: [uuid, ...childrenIds] },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
