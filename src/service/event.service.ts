import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Event from "../models/event.model";
import EventI, { EventSI } from "../interfaces/event.interface";

const eventRouter = Router()

export default class EventService{

    static post = async (req: Request, res: Response) => {
        try {
           
            const e: EventI = req.body

            const event = await Event.create(e)

            res.send(event)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            // let {limit, offset} = req.query;
            // const events = await Event.findAndCountAll({offset, limit})
            const events = await Event.find()
            res.send(events);
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    /*static get = async (req: Request, res: Response) => {
        try {
            let designerEvents = await EventDesigner.findAll();
            const result = await Promise.all(designerEvents.map(item => this.getDesignerEvent(req, item)));
            res.send(result);
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    async getDesignerEvent(req: Request, item: object){
        let {limit, offset} = req.query;
        const events = await Event.findAndCountAll({offset, limit})
    }*/



    static getId =  async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            if(!_id){
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
            }
            const event = await Event.findById(_id)
            res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const eventData: EventI = req.body
            const _id = req.params.id
            const newEvent = await Event.findByIdAndUpdate({_id},  eventData, { new: true }) // to return the updated data do - returning: true

            res.send(newEvent)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
