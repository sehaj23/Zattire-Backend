import BaseService from "./base.service"
import Booking from "../../models/booking.model"
import Salon from "../../models/salon.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import Service from "../../models/service.model"
import { ServiceSI } from "../../interfaces/service.interface"
import Offer from "../../models/offer.model"
import * as moment from "moment"
import Employee from "../../models/employees.model"
import Photo from "../../models/photo.model"





export default class BookinkService extends BaseService {

    constructor() {
        super(Booking)
    }

    post = async (req: Request, res: Response) => {
        try {
            const e: BookingI = req.body

            if (!e.salon_id && !e.makeup_artist_id && !e.designer_id) {
                const errMsg = `Atleast one provider is is reqired out of 3`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            // if(e.salon_id){
            //     e.salon_id = mongoose.Types.ObjectId(e.salon_id.toString())
            // }
            // if(e.makeup_artist_id){
            //     e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id.toString())
            // }
            // if(e.designer_id){
            //     e.designer_id = mongoose.Types.ObjectId(e.designer_id.toString())
            // }

            if (!e.designer_id) {
                const { services } = e;
                if (!services) {
                    const errMsg = `Services not defined`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                if (services.length === 0) {
                    const errMsg = `Atleast one services is required. Length is 0`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                const serviceIds = [];
                for (let s of services) {
                    if (s.service_id) {
                        if (!s.service_time) {
                            const errMsg = `Service time not found for id: ${s.service_id}`;
                            logger.error(errMsg);
                            res.status(400);
                            res.send({ message: errMsg });
                            return;
                        }
                        serviceIds.push(mongoose.Types.ObjectId(s.service_id));
                    } else {
                        const errMsg = `Service Id not found: 22`;
                        logger.error(errMsg);
                        res.status(400);
                        res.send({ message: errMsg });
                        return;
                    }
                }

                if (serviceIds.length === 0) {
                    const errMsg = `Service Ids not found`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                const serviceInfoReq = Service.find({ _id: { $in: serviceIds } })
                const offerInfoReq = Offer.find({ service_id: { $in: serviceIds } })
                const [serviceInfo, offerInfo] = await Promise.all([serviceInfoReq, offerInfoReq])

                if (serviceInfo.length === 0) {
                    const errMsg = `serviceInfo not found`
                    logger.error(errMsg)
                    res.status(400)
                    res.send({ message: errMsg })
                    return
                }

                for (let offer of offerInfo) {
                    for (let service of serviceInfo) {
                        if (offer._id === service._id) {
                            // TODO: 
                        }
                    }
                }
            }



            const event = await Booking.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`Post ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }

    }
    getSalonEmployees = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.salonId;
            if (!salonId) {
                const errMsg = `Salon Id not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
                return;
            }
            const { dateTime } = req.body;
            if (!dateTime) {
                const errMsg = `dateTime not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
            }

            const dateTimeD = new Date(dateTime);

            const busyEmployeesIds = [];

            // @ts-ignore
            const bookings = await Booking.findOne({ services: { service_time: dateTimeD }, salon_id: salonId });
            console.log("*********Got bookings ****************");
            console.log(bookings);

            if (bookings !== null) {
                for (const bs of bookings.services) {
                    busyEmployeesIds.push(bs.employee_id);
                }
            }

            const salon = await Salon.findById(salonId).populate("employees").exec();
            if (!salon) {
                const errMsg = `salon not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
            }

            for (const bemp of busyEmployeesIds) {
                //@ts-ignore
                const i = salon.employees.findIndex((e) => e._id === bemp);
                if (i !== -1) {
                    salon.employees.splice(i, 1);
                }
            }

            res.send(salon);
        } catch (e) { }
    };

    getSalonBookings = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId) {
                const errMsg = 'Salon Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ salon_id: salonId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getmakeupArtistBookings = async (req: Request, res: Response) => {
        try {
            const makeupArtistId = req.params.id
            if (!makeupArtistId) {
                const errMsg = 'Makeup Artist ID not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ smakeup_artist_id: makeupArtistId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getDesignerBookings = async (req: Request, res: Response) => {
        try {
            const designerId = req.params.id
            if (!designerId) {
                const errMsg = 'Designer Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ designer_id: designerId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingSalonBookings = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId) {
                const errMsg = 'Salon Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ salon_id: salonId, status: "Requested" })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            res.send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingmakeupArtistBookings = async (req: Request, res: Response) => {
        try {
            const makeupArtistId = req.params.id
            if (!makeupArtistId) {
                const errMsg = 'Makeup Artist ID not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ smakeup_artist_id: makeupArtistId, status: "Requested" }).populate("makeup_artists").populate("designers").populate("salons").exec()
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingDesignerBookings = async (req: Request, res: Response) => {
        try {
            const designerId = req.params.id
            if (!designerId) {
                const errMsg = 'Designer Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ designer_id: designerId, status: "Requested" })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }


    updateStatusBookings = async (req: Request, res: Response) => {

        try {
            const bookingid = req.params.id
            const status = req.body.status

            if (!bookingid) {
                const errMsg = 'Booking Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            if (!status) {
                const errMsg = 'status not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            const bookings = await Booking.findByIdAndUpdate({ _id: bookingid }, { status: status }, { new: true, runValidators: true })

            res.send(bookings)

        } catch (error) {
            console.log(error)
            const errMsg = "Error updating Status"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }


    }

    assigneEmployeeBookings = async (req: Request, res: Response) => {

        try {
            const bookingId = req.params.id
            const employeeId = req.body.employee_id
            const serviceName = req.body.service_name
            if (!bookingId) {
                const errMsg = 'Booking  not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            if (!employeeId || !serviceName) {
                const errMsg = 'not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const booking = await Booking.update({ _id: bookingId, service: { service_name: serviceName } }, { employee_id: employeeId },{new:true})
            res.send(booking)

        } catch (error) {
            const errMsg = "Error updating employee"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

    }

    getBookings = async (req: Request, res: Response) => {

        const match = {}
        const date = moment().format('YYYY-MM-DD')
        const page = parseInt(req.query.page, 10) || 0
        const limit = parseInt(req.query.limit, 10) || 10





        try {


            if (req.query.status || req.query.employee || req.query.service || req.query.startdate || req.query.lastdate) {



                if (req.query.status) {
                    //@ts-ignore
                    match.status = req.query.status
                }

                if (req.query.services) {
                    //@ts-ignore
                    match.services = { service: { $elemMatch: { service_name: req.query.service } } }
                }
                //testing for employee is left
                if (req.query.employee_id) {
                    //@ts-ignore
                    match.services = { service: { $elemMatch: { employee_id: req.query.employee } } }
                }

                if (req.query.startdate && req.query.lastdate) {

                    console.log(req.query.startdate)
                    //@ts-ignore
                    match.date_time = { "$gte": new Date(req.query.startdate), "$lt": new Date(req.query.lastdate) }
                }


                //@ts-ignore
                const booking = await Booking.find((match)).limit(limit).skip(page * limit)
                res.send(booking)


            } else {


                //@ts-ignore

                const booking = await Booking.find({ date_time: { "$gte": date } }).limit(limit).skip(page * limit)
                return res.send(booking)
                // check with date thing from db
            }
        } catch (e) {
            const errMsg = "Error fetching bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }

    }
    getbookingbyid = async (req: Request, res: Response) => {

        try {


            const id = req.params.id
            if (!id) {
                const errMsg = "Error fetching bookings"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const booking = await Booking.findById(id).populate({path:"services.service_id",model:Service,populate:{path:"offers",model:Offer}}).populate({path:"services.employee_id",model:Employee,select:"name phone",populate:{path:"photo",model:Photo}})
            res.send(booking)



        } catch (error) {
            const errMsg = "Error fetching bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }
    reschedulebooking = async (req: Request, res: Response) => {

        try {
            const id =req.params.id
            const date_time = req.body.date_time
            const date = moment().format('YYYY-MM-DD')
            console.log(date)
            if(date_time<date){
                const errMsg = "Cannot reschedule for past dates!"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            if(!id){
                const errMsg = "Error Booking not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
                
            }
            const booking = await Booking.findByIdAndUpdate(id,{date_time:date_time},{new:true})
            if(!booking){
                const errMsg = "unable to update boooking"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.send(booking)
        } catch (error) {
            
            const errMsg = "Error Bookingg not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
    }

}