import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// domyślny element root
const DEFAULT_ELEMENTS = [
  {
    id: 1,
    type: "block",
    styles: { padding: "20px" },
    children: [],
  },
];

/**
 * GET /knowledge?user_uuid=xxx&project_uuid=yyy
 */
export const getKnowledge = async (req, res) => {
  try {
    const { user_uuid, project_uuid } = req.query;
    if (!user_uuid || !project_uuid) {
      return res.status(400).json({ error: "Brak user_uuid lub project_uuid" });
    }

    const filePath = path.join(DATA_DIR, `${user_uuid}_${project_uuid}.json`);

    // jeśli plik nie istnieje → tworzymy z DEFAULT_ELEMENTS
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

/**
 * POST /knowledge
 * body: { user_uuid, project_uuid, elements }
 */
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
