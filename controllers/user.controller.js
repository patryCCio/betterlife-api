import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

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

const generateAccessToken = async () => {
  
}

const createUser = async () => {

  // cb8ff62e-5272-4cd7-a7de-0adaf4198245
  const password = "01WRXB123bnp!";
  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullname: "Patryk Szczerbiński",
    nickname: "patryCCio",
    email: "patryk.szczerbinski00@gmail.com",
    password: hashed,
    points: 190
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

export const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    let result = await User.find({ email: login });

    if (result.length == 0) {
      result = await User.find({ nickname: login });
    }

    if (result.length == 0) {
      return res.status(404).json({ message: "Wrong login or password!" });
    }

    const user = result[0];

    // 🔐 porównanie hasła (ZAMIAST decrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Wrong login or password!" });
    }

    res.status(200).json({
      uuid: user.uuid,
      nickname: user.nickname,
      email: user.email,
      fullname: user.fullname,
      points: user.points
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

