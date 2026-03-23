import { User } from "../models/user.model.js";

export const getUser = async (req, res) => {
  try {
    const { uuid } = req.query;

    if (!uuid) {
      return res.status(400).json({ message: "Brak uuid" });
    }

    const user = await User.findOne({ uuid });

    // createUser();

    if (!user) {
      return res.status(404).json({ message: "User nie istnieje" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const createUser = async () => {
  const user = new User({
    fullname: "Patryk Szczerbiński",
    nickname: "patryCCio",
  });

  await user.save();
};

export const setPoints = async (req, res) => {
  try {
    const { uuid, pointsToAdd } = req.body;

    if (!uuid || typeof pointsToAdd !== "number") {
      return res.status(400).json({ message: "Błędne dane" });
    }

    const user = await User.findOneAndUpdate(
      { uuid },
      { $inc: { points: pointsToAdd } }, // 🔥 kluczowe
      { new: true }, // zwraca zaktualizowany dokument
    );

    if (!user) {
      return res.status(404).json({ message: "User nie istnieje" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
