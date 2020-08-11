import { Router } from "express"

import Booking from "../../models/booking.model"
import Salon from "../../models/salon.model"
import BookingController from "../../controller/booking.controller"
import SalonService from "../../service/salon.service"
import Employee from "../../models/employees.model"
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import Review from "../../models/review.model"
import Brand from "../../models/brands.model"
import EmployeeAbsenteesmService from "../../service/employee-absentism.service"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"
import BookingService from "../../service/booking.service"
import UserverifyToken from "../../middleware/User.jwt"

const bookingService = new BookingService(Booking, Salon)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand)
const empAbsenteesimService = new EmployeeAbsenteesmService(EmployeeAbsenteeism)
const bc = new BookingController(bookingService, salonService, empAbsenteesimService)
const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/",UserverifyToken, bc.getAppointment)

// create a booking
bookingRouter.post("/",UserverifyToken, bc.bookAppointment)

export default bookingRouter
