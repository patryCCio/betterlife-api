import { RoutineDay } from "../models/routineday.model.js"

export const initInterval = async () => {
    const now = new Date();
    
    // początek dzisiejszego dnia
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // początek wczoraj
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    await RoutineDay.updateMany(
        {
            last_date: { $lt: startOfYesterday } // starsze niż wczoraj → min. 2 dni różnicy kalendarzowej
        },
        {
            $set: { series: 0 }
        }
    );

    console.log("Reset wykonany");
};