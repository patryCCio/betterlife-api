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
  const { selectedDate } = req.query;

  try {
    const date = new Date(selectedDate);

    const startOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0,
    );
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const todos = await Task.find({
      user_uuid,
      start: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).sort({ start: 1 });

    console.log(todos);

    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { user_uuid } = req.params;
    const { uuid, type, title, start, end, color, parentId = null } = req.body;

    const task = await Task.create({
      uuid,
      type,
      title,
      start,
      end,
      color,
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

    await Task.findOneAndDelete({
      uuid,
      user_uuid,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
