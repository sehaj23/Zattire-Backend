import { Router } from "express";
import EmployeeverifyToken from "../../middleware/Employee.jwt"
import Bookingservice from "../../service/VendorAppService/booking.service";
import VendorverifyToken from "../../middleware/VendorJwt";
const bookingRouter = Router()
const bs = new Bookingservice()



bookingRouter.get("/",VendorverifyToken,bs.getbookings)
bookingRouter.get("/reschedule/:id",VendorverifyToken,bs.rescheduleSlots)
bookingRouter.patch("/reschedule/:id",VendorverifyToken,bs.rescheduleBooking)
bookingRouter.patch("/updatestatus/:id",VendorverifyToken,bs.updateStatusBookings)


//employee
bookingRouter.get("/employee",EmployeeverifyToken,bs.getEmployeebookings) //salon id required
bookingRouter.patch("/employee/updatestatus/:id",EmployeeverifyToken,bs.updateStatusBookings) //booking id required
bookingRouter.get("/employee/reschedule/:id",EmployeeverifyToken,bs.rescheduleSlots)
bookingRouter.patch("/employee/reschedule/:id",EmployeeverifyToken,bs.rescheduleBooking)
//bookingRouter.get("/employee/booking",EmployeeverifyToken,bs.getEmployeebookings)




export default bookingRouter