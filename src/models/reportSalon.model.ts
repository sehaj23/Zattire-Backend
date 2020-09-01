import mongoose from "../database";
import salons = require("../seeds/data/salons/salons");


const ReportSchema = new mongoose.Schema({
    
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
    },
    error:{
        type: [String],
    },
    info: {
        required: true,
        type: String,
    },
   


})
const ReportSalon = mongoose.model("reportSalon", ReportSchema)

export default ReportSalon