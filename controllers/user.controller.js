import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.uuid }, // 👈 user_uuid
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

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

export const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub: uuid }
    next();
  } catch {
    return res.sendStatus(403);
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // 🔐 weryfikacja podpisu
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // 🔎 sprawdzenie czy istnieje w DB
    const session = await Session.findOne({ refresh_token: refreshToken });

    if (!session) {
      return res.status(403).json({ message: "Invalid session" });
    }

    // 👤 pobierz usera
    const user = await User.findOne({ uuid: decoded.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ♻️ ROTACJA refresh tokena (ważne!)
    const newRefreshToken = generateRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    // update w DB
    session.refresh_token = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Wrong login or password!" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // TODO: zapisz refreshToken w DB (Session)

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        uuid: user.uuid,
        nickname: user.nickname,
        email: user.email,
        fullname: user.fullname,
        points: user.points
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

