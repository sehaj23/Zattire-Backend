import mongoose from "../database";
import MakeupArtistSI from "../interfaces/makeupArtist.interface";


const MakeupArtistSchema = new mongoose.Schema({
    name: {
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
    services: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "service"
        }],
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
        required: true,
    },
    fb_link:{
        type: String,
        required: true,
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
        ref: "vendor",
        required: true
    },
}, {
    timestamps: true
})

const MakeupArtist = mongoose.model<MakeupArtistSI>("makeup_artists", MakeupArtistSchema)

export default MakeupArtist