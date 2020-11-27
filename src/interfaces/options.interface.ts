import mongoose from "../database";
import { OfferI } from "./offer.interface";


export default interface OptionI{
    _id?: mongoose.Schema.Types.ObjectId
    option_name:String,
    price:number,
    duration:number,
    gender:String,
    photo?: mongoose.Schema.Types.ObjectId | String
    offers?: OfferI[]
    at_home?: boolean
}

