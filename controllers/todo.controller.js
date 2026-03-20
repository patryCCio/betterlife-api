import fs from "fs/promises";
import path from "path";

export const getTodo = async (req, res) => {
  const { btnState, sortBy } = req.body;

  try {
    const filePath = path.join(process.cwd(), "data", "todos.json");
    const data = await fs.readFile(filePath, "utf-8");
    const todos = JSON.parse(data);


    // FILTER
    const filtered = todos.filter((t) => {
      if (btnState === "done") return t.done === true;
      if (btnState === "undone") return t.done === false;
      return true;
    });

    // SAFE HELPERS
    const getDate = (d) => (d ? new Date(d).getTime() : 0);
    const getSubCount = (t) => t.subtask?.length || 0;

    // SORT MAP
    const sortMap = {
      none: null,
      createdDesc: (a, b) => getDate(b.deadline) - getDate(a.deadline),
      createdAsc: (a, b) => getDate(a.deadline) - getDate(b.deadline),
      priorityDesc: (a, b) => b.priority - a.priority,
      priorityAsc: (a, b) => a.priority - b.priority,
      countTaskDesc: (a, b) => getSubCount(b) - getSubCount(a),
      countTaskAsc: (a, b) => getSubCount(a) - getSubCount(b),
    };

    const sorted = [...filtered]; // żeby nie mutować oryginału

    if (sortBy && sortMap[sortBy]) {
      sorted.sort(sortMap[sortBy]);
    }

    res.status(200).json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const addTodo = async (req, res) => {};

export const deleteTodo = async (req, res) => {};
