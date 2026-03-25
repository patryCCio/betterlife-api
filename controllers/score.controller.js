import { RoutineDay } from "../models/routineday.model.js";
import { Score } from "../models/score.model.js";

export const getScores = async (req, res) => {
  const { date, user_uuid } = req.query;

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const scores = await Score.find({
      user_uuid,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: -1 });

    let total = 0;

    scores.forEach((el) => {
      total += el.points;
    });

    res.status(200).json({ scores, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addScore = async (req, res) => {
  const {
    user_uuid,
    type,
    points = 0,
    additionalInfo = null,
    array = [],
  } = req.body;

  try {
    if (type === "task" && Array.isArray(array)) {
      const scores = array.map((el) => ({
        user_uuid,
        points: el.priority * 10,
        label: `Task "${el.title}" has been finished!`,
      }));

      await Score.insertMany(scores);
    } else {
      let label = "";

      if (type == "routine") {
        label = `Add points for routine "${additionalInfo.text}"!`;
      } else if (type == "award") {
        label = `Get points for award "${additionalInfo.text}"!`;
      }

      const score = new Score({
        user_uuid,
        label,
        points,
      });

      await score.save();

      if (type == "routine") {
        const routineDay = new RoutineDay({
          user_uuid,
          routine_uuid: additionalInfo.routine_uuid
        })

        await routineDay.save();
      }
    }

    res.status(200).json("ok!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
