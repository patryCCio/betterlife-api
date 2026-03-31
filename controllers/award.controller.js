import { Award } from "../models/award.model.js";

export const getAwards = async (req, res) => {
  try {
    const { user_uuid } = req.query;

    if (!user_uuid) return res.status(400);

    const awards = await Award.find({ user_uuid });

    res.status(200).json(awards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addAward = async (req, res) => {
  const { title, cost, user_uuid } = req.body;

  try {
    const award = new Award({
      title,
      cost,
      user_uuid,
    });

    await award.save();

    res.status(200).json(award);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAward = async (req, res) => {
  const { uuid } = req.params;
  const { user_uuid } = req.query;

  try {
    await Award.findOneAndDelete({ uuid, user_uuid });
    const awards = await Award.find({ user_uuid });
    res.status(200).json(awards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
