import { Routine } from "../models/routine.model.js";
import { RoutineDay } from "../models/routineday.model.js";

export const getRoutine = async (req, res) => {
  const { user_uuid } = req.query;

  try {
    const now = new Date();

    // początek dnia
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    // koniec dnia
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const routineDay = await RoutineDay.find({
      user_uuid: user_uuid,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const routines = await Routine.find({ user_uuid });

    const doneSet = new Set(routineDay.map((r) => r.routine_uuid));

    const array = routines.map((r) => ({
      ...r._doc,
      done: doneSet.has(r.uuid),
    }));

    res.status(200).json(array);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addRoutine = async (req, res) => {
  const { title, type, user_uuid, count } = req.body;

  try {
    const routine = new Routine({
      title,
      type,
      count,
      user_uuid,
    });

    await routine.save();

    res.status(200).json(routine);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoutine = async (req, res) => {
  const { uuid } = req.params;
  const { user_uuid } = req.query;

  try {
    await Routine.findOneAndDelete({ uuid, user_uuid });
    const routines = await Routine.find({ user_uuid });
    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkRoutine = async (req, res) => {
  
}