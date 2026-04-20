import fs from "fs";
import path from "path";
import { Category } from "../models/category.model.js";
import { Post } from "../models/posts.model.js";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// domyślny element root
const DEFAULT_ELEMENTS = [
  {
    id: 1,
    type: "block",
    styles: {
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      gap: "20px",
      overflowX: "hidden",
      overflowY: "auto",
    },
    children: [],
  },
];

export const getKnowledge = async (req, res) => {
  try {
    const { user_uuid, project_uuid } = req.query;
    if (!user_uuid || !project_uuid) {
      return res.status(400).json({ error: "Brak user_uuid lub project_uuid" });
    }

    const filePath = path.join(DATA_DIR, `${user_uuid}_${project_uuid}.json`);

    // jeśli plik nie istnieje → tworzymy z DEFAULT_ELEMENTS432``2
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(DEFAULT_ELEMENTS, null, 2),
        "utf-8",
      );
      return res.json(DEFAULT_ELEMENTS);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd odczytu pliku" });
  }
};

export const saveKnowledge = async (req, res) => {
  try {
    const { user_uuid, project_uuid, elements } = req.body;
    if (!user_uuid || !project_uuid || !elements) {
      return res.status(400).json({ error: "Brak danych do zapisania" });
    }

    const filePath = path.join(DATA_DIR, `${user_uuid}_${project_uuid}.json`);

    fs.writeFileSync(filePath, JSON.stringify(elements, null, 2), "utf-8");
    return res.json({ message: "Zapisano pomyślnie" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd zapisu pliku" });
  }
};

export const getKnowledgeCategory = async (req, res) => {
  const { uuid } = req.params;
  try {
    const data = await Category.find({ user_uuid: uuid });

    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong! Try again later!" });
  }
};

export const addKnowledgeCategory = async (req, res) => {
  const { name, user_uuid } = req.body;

  try {
    const cat = new Category({
      user_uuid,
      name: name.toUpperCase(),
    });

    await cat.save();

    return res.status(200).json("OK!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong! Try again later!" });
  }
};

export const getKnowledgePosts = async (req, res) => {

  const { sort, search } = req.params;

  try {
    const d = await Post.find({ user_uuid });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong! Please try again later!" });
  }
}

export const deleteKnowledgeCategory = async (req, res) => {
  const { uuid } = req.params;

  console.log(uuid);

  try {
    await Category.findOneAndDelete({ uuid });
    return res.status(200).json("Ok!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong! Try again later!" });
  }
};
