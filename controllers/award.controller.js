import { Award } from "../models/award.model.js";

export const getAwards = async (req, res) => {
    try {
        const awards = await Award.find();

        res.status(200).json(awards);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const addAward = async (req, res) => {
    const { title, cost } = req.body;

    try {
        const award = new Award({
            title,
            cost
        })

        await award.save();

        res.status(200).json(award);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteAward = async (req, res) => {
    const { uuid } = req.params;
    try {
        await Award.findOneAndDelete({ uuid });
        const awards = await Award.find();
        res.status(200).json(awards);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}