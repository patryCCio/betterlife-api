import { Routine } from "../models/routine.model.js";

export const getRoutine = async (req, res) => {
    try {
        const routines = await Routine.find();

        res.status(200).json(routines);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const addRoutine = async (req, res) => {
    const { title, cost } = req.body;

    try {
        const routine = new Routine({
            title,
            cost
        })

        await routine.save();

        res.status(200).json(routine);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteRoutine = async (req, res) => {
    const { uuid } = req.params;
    try {
        await Routine.findOneAndDelete({ uuid });
        const routines = await Routine.find();
        res.status(200).json(routines);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}