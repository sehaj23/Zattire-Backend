import { Router } from "express";

import UserService from "../../service/user.service";

import CONFIG from "../../config";
import User from "../../models/user.model";
import UserController from "../../controller/user.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import { walkUpBindingElementsAndPatterns } from "typescript";

const userRouter = Router()
const userService = new UserService(User,Booking)
const userController= new UserController(userService)



userRouter.get("/info",UserverifyToken,userController.getUser)
userRouter.patch("/update",UserverifyToken,userController.update)
userRouter.patch("/password",UserverifyToken,userController.updatePassword)
userRouter.get("/bookings",UserverifyToken,userController.pastBooking)
userRouter.patch("/address",UserverifyToken,userController.addAddress)
userRouter.get("/address",UserverifyToken,userController.getAddress)
userRouter.put("/profile-photo",UserverifyToken,userController.putProfilePic)

export default userRouter
