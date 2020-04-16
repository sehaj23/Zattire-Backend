import mongoose from "../database";
import { DesignersSI } from "../interfaces/designer.interface";

const DesignerSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true
    },
    designer_name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    contact_number:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    start_price: {
        type: Number,
        required: true
    },
    end_price: {
        type: Number,
        required: true
    },
    outfit_types: {
        type: [{type: String}],
    },
    speciality: {
        type: [{type: String}],
        required: true
    },
    location:{
        type: String,
        required: true,
    },
    insta_link:{
        type: String,
    },
    fb_link:{
        type: String,
    },
    start_working_hours: {
        type: [Date],
        required: true
    },
    end_working_hours: {
        type: [Date],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    photo_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "photo"
        }]
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors"
    },
    events: {
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "events"
        }]
    }

}, {
    timestamps: true
})

const Designer = mongoose.model<DesignersSI>("designers", DesignerSchema, 'designers')

export default Designer