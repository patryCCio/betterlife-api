import { Routine } from "../models/routine.model.js";
import { RoutineDay } from "../models/routineday.model.js";

export const getRoutine = async (req, res) => {
  const { user_uuid } = req.query;

  try {
    const routines = await Routine.aggregate([
      { $match: { user_uuid } },
      {
        $lookup: {
          from: "routinedays",
          localField: "uuid",
          foreignField: "routine_uuid",
          as: "routine_days",
        },
      },
    ]);

    const now = new Date();

    // now.setDate(now.getDate() + 1);

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const array = [];

    routines.forEach((el) => {
      const obj = el.routine_days;

      let done = false;

      if (obj.length > 0) {
        done = obj.some((rd) => {
          const date = new Date(rd.last_date);
          return date >= start && date <= end;
        });
      }

      array.push({
        ...el,
        done,
      });
    });


    res.status(200).json(array);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkPoints = async (req, res) => {
  const { routine, user_uuid } = req.body;

  let isLower = false;
  let isHigher = false;

  if (routine.done) return res.status(404).json("This routine has been taken!");

  if (routine.type != "none" && routine.actual_count == 0) return res.status(404).json("Please change count for routine!");

  try {
    const d = await RoutineDay.findOne({ user_uuid, routine_uuid: routine.uuid })

    let points = 0;

    const { actual_count, count } = routine;

    if (!d) {
      const d2 = new RoutineDay({
        user_uuid,
        routine_uuid: routine.uuid,
        series: 1,
        last_date: new Date(),
        other_count: actual_count != count ? actual_count : 0,
        series_other_count: actual_count != count ? 1 : 0,
      })

      await d2.save();

      if (actual_count == count) {
        points += 10;
      } else if (actual_count < count) {
        points += 5;
      } else if (actual_count > count) {
        const diff = actual_count - count;

        points = 10 + (diff * 10);
      }

    } else {
      if (routine.type == "none") {
        const updated = await RoutineDay.findOneAndUpdate(
          {
            user_uuid,
            routine_uuid: routine.uuid
          },
          {
            $set: { last_date: new Date(), series: d.series + 1 }
          },
          {
            new: true,
            runValidators: true
          }
        );
      } else {
        if (count == actual_count) {
          const updated = await RoutineDay.findOneAndUpdate(
            {
              user_uuid,
              routine_uuid: routine.uuid
            },
            {
              $set: { last_date: new Date(), series: d.series + 1, series_other_count: 0 }
            },
            {
              new: true,
              runValidators: true
            }
          );
        } else {
          if (actual_count < count) {
            isLower = true;
            const updated = await RoutineDay.findOneAndUpdate(
              {
                user_uuid,
                routine_uuid: routine.uuid
              },
              {
                $set: { last_date: new Date(), series_other_count: d.series_other_count + 1 }
              },
              {
                new: true,
                runValidators: true
              }
            );

            if (updated.series_other_count >= 3) {
              const updated2 = await Routine.findOneAndUpdate(
                {
                  user_uuid,
                  uuid: routine.uuid
                },
                {
                  $set: { count: routine.count - 1 }
                },
                {
                  new: true,
                  runValidators: true
                }
              )
              const updated3 = await RoutineDay.findOneAndUpdate(
                {
                  user_uuid,
                  routine_uuid: routine.uuid
                },
                {
                  $set: { series_other_count: 0, series: 0, other_count: 0 }
                },
                {
                  new: true,
                  runValidators: true
                }
              );
            }

          } else {
            isHigher = true;
            const updatedd = await RoutineDay.findOneAndUpdate(
              {
                user_uuid,
                routine_uuid: routine.uuid
              },
              {
                $set: { last_date: new Date(), series_other_count: d.series_other_count + 1, series: d.series + 1 }
              },
              {
                new: true,
                runValidators: true
              }
            );

            if (updatedd.series_other_count >= 3) {
              const updated2 = await Routine.findOneAndUpdate(
                {
                  user_uuid,
                  uuid: routine.uuid
                },
                {
                  $set: { count: routine.count + 1 }
                },
                {
                  new: true,
                  runValidators: true
                }
              )
              const updated3 = await RoutineDay.findOneAndUpdate(
                {
                  user_uuid,
                  routine_uuid: routine.uuid
                },
                {
                  $set: { series_other_count: 0, other_count: 0 }
                },
                {
                  new: true,
                  runValidators: true
                }
              );

            }
          }
        }

      }

      if (d.series + 1 >= 1 && d.series + 1 < 7) {
        points += 10;
      } else if (d.series + 1 >= 7 && d.series + 1 < 14) {
        points += 20;
      } else if (d.series + 1 >= 14 && d.series + 1 < 21) {
        points += 25;
      } else if (d.series + 1 >= 21 && d.series + 1 < 31) {
        points += 20;
      } else if (d.series + 1 >= 31 && d.series + 1 < 46) {
        points += 15;
      } else if (d.series + 1 >= 46 && d.series + 1 < 93) {
        points += 10;
      } else {
        points += 5;
      }

      if (isLower) {
        points /= 2;
      }

      if (isHigher) {
        let diff = actual_count - count;
        points += (10 * diff);
      }
    }

    res.status(200).json(points);
  } catch (error) {
    res.status(500).json(error);
  }
}

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