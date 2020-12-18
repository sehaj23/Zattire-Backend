import { Router } from "express"
import SalonController from "../../controller/salon.controller"
import Booking from '../../models/booking.model'
import Brand from "../../models/brands.model"
import Employee from "../../models/employees.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import ReportSalon from "../../models/reportSalon.model"
import Review from '../../models/review.model'
import Salon from "../../models/salon.model"
import UserSearch from "../../models/user-search.model"
import Vendor from "../../models/vendor.model"
import SalonService from "../../service/salon.service"
import UserSearchService from "../../service/user-search.service"
const searchRouter = Router()
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const userSearch = new UserSearchService(UserSearch)
const salonController = new SalonController(salonService, userSearch)
searchRouter.get("/", salonController.getSearchResult)
searchRouter.get("/salon",salonController.searchFilter)
searchRouter.get("/service",salonController.getSearchservice)

export default searchRouter
