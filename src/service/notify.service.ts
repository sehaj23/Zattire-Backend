
import moment = require("moment")
import { BookingI, BookingSI } from "../interfaces/booking.interface"
import EmployeeSI, { EmployeeI } from "../interfaces/employee.interface"
import SalonSI, { LocationI, SalonI } from "../interfaces/salon.interface"
import UserI, { UserSI } from "../interfaces/user.interface"
import { VendorI } from "../interfaces/vendor.interface"
import SendEmail from "../utils/emails/send-email"
import sendNotificationToDevice from "../utils/send-notification"
import SMSCONFIG from "../utils/sms-config"
import BookingService from "./booking.service"
import OtpService from "./otp.service"

export default class Notify {

//TODO: Null check for params because booking fails

    static bookingConfirm = async (user:UserSI,salon:SalonSI,employee:EmployeeSI,booking:BookingSI) => {
      try{  
        const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
        const getDetails = Notify.getTotalPromo(booking)
      SendEmail.bookingConfirm(user.email, salon.name, booking._id, booking.booking_numeric_id.toString(), bookingTime,employee.name,booking.location,booking.payment_type,getDetails.total.toString(),getDetails.promo_code,booking.services)
      }catch(e){
        console.log(e)
      } 
      try {
        sendNotificationToDevice("dQRmA4ylYE52s-dvl9QnSF:APA91bEG0qxPTwZEk_F0N9gB5ab-Q8y-Xc88A_7-DcLp37XAs6ppRKkcqfD87MUImbOi6tc2dPqvVQqG-MOpQ2-ccC_EGqrer12HlL5y09LFakcXccR6tx03jmRoaAXx1CuNwTsyqzBz", { notification: {title:"Booking Confirmed",body: `Your booking for ${booking.services[0].service_time} has been accepted by ${salon.name}`},data:{booking_id:booking._id,status:"Confirmed",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
      } catch (error) {
        
      }
      // TODO: Add notification data and the route
      try {
        sendNotificationToDevice(user.fcm_token, { notification: {title:"Booking Confirmed",body: `Your booking for ${booking.services[0].service_time} has been accepted by ${salon.name}`},data:{booking_id:booking._id,status:"Confirmed",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
      } catch (error) {
        console.log(error)
      }
    
       
        //TODO: change the text of the uszer text 
        try {
          const userText = `Your booking for ${booking.services[0].service_time} has been accepted by ${salon.name}, CHEERS ZATTIRE ENTERPRISES`
          OtpService.sendMessage(user.phone, userText,SMSCONFIG.BOOKING_ACCEPTED)
        } catch (error) {
          
        }
      
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static bookingRequest = async (vendor:VendorI,employee:EmployeeI,salon:SalonI,booking:BookingSI,user:UserI) => {
     
      const getDetails = Notify.getTotalPromo(booking)
      const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
      try {
        SendEmail.bookingRequestVendor(salon.email,salon.name,booking._id,booking.booking_numeric_id.toString(),bookingTime,employee.name,booking.location,booking.payment_type,getDetails.total.toString(),getDetails.promo_code,booking.services,user.name,vendor.name)
      } catch (error) {
        console.log(error)
      }  
        // TODO: Add notification data and the route
        try {
          sendNotificationToDevice(vendor.fcm_token, { notification: {title:"Booking Request",body: `${employee.name} has received a new booking for ${bookingTime}`},data:{booking_id:booking._id,status:"Requested",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
        } catch (error) {
          console.log(error)
        }
        try {
          sendNotificationToDevice(employee.fcm_token, { notification: {title:"Booking Request",body: `You have received a new booking for ${bookingTime}`},data:{booking_id:booking._id,status:"Requested",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
        } catch (error) {
          console.log(error)
        }

       
      
      
         //check
        //TODO: change the text of the uszer text 
        try {
          const vendorText = `Received a new booking for ${bookingTime} ZATTIRE ENTERPRISES`
          console.log("sending message")
          OtpService.sendMessage(vendor.contact_number, vendorText,SMSCONFIG.NEW_BOOKING)
        } catch (error) {
          console.log(error)
        }
       
       
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static rescheduledPending = async (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string,userName:string) => {
       try {
        SendEmail.rescheduleUser(userEmail, userName)
       } catch (error) {
         console.log(error)
       } 
        // TODO: Add notification data and the route
       try {
        sendNotificationToDevice(userFCM, { notification: {title:"Booking Rescheduled",body: `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open`},data:{booking_id:bookingId,status:"Rescheduled and Pending",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
       } catch (error) {
         
       }

    
        //TODO: change the text of the uszer text 
        try {
          const userText = `To make up for the current unavailability ${salonName} has sent you new time slots ZATTIRE ENTERPRISES`
        OtpService.sendMessage(userPhone, userText,SMSCONFIG.RESCHEDULE)
        } catch (error) {
          
        }
         //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

 


    static rescheduledBooking = (vendor:VendorI,user:UserSI,booking:BookingSI,employee:EmployeeSI,salon:SalonI) => {
   
      const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
      const getDetails = Notify.getTotalPromo(booking)
      SendEmail.rescheduleVendor(salon.email, salon.name, booking._id, booking.booking_numeric_id.toString(), bookingTime,employee.name,booking.location,booking.payment_type,getDetails.total.toString(),getDetails.promo_code,booking.services,user.name)
      
          // TODO: Add notification data and the route

      

          try {
            sendNotificationToDevice(employee.fcm_token, { notification: {title:"Booking Reschedule Accepted",body: `The booking you rescheduled for ${bookingTime} has been accepted`},data:{booking_id:booking._id,status:"Requested"}})
          } catch (error) {
            
          }

          try {
            sendNotificationToDevice(vendor.fcm_token, { notification: {title:"Booking Reschedule Accepted",body: `The rescheduled booking by ${employee.name} for ${bookingTime} has been accepted’
            `},data:{booking_id:booking._id,status:"Rescheduled"}})
          } catch (error) {
            
          }

         
         
          //TODO: change the text of the uszer text 
          try {  
           const vendorText = `The rescheduled booking by ${employee.name} for ${bookingTime} has been accepted`
          OtpService.sendMessage(vendor.contact_number, vendorText,SMSCONFIG.RESCHEDULE_ACCEPT)

            
          } catch (error) {
            
          }
                 //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
          //if required
      }

      static rescheduledCancelled = (vendorPhone: string, employeeFCMs: string[], bookingId: string, employeeName: string, dateTime: string,vendorFCM:string,salonEmail:string,salonName:string,bookingIdNumeric:string) => {
        //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
          // TODO: Add notification data and the route
          try {
            sendNotificationToDevice(employeeFCMs, { notification: {title:"Booking  Cancelled",body: `The rescheduled booking has been cancelled by the user`},data:{booking_id:bookingId,status:"Rescheduled and Cancelled"}})
            sendNotificationToDevice(vendorFCM, { notification: {title:"Booking  Cancelled",body: `The rescheduled booking has been cancelled by the user`},data:{booking_id:bookingId,status:"Rescheduled"}})

          } catch (error) {
            
          }
          try {
            sendNotificationToDevice("dQRmA4ylYE52s-dvl9QnSF:APA91bEG0qxPTwZEk_F0N9gB5ab-Q8y-Xc88A_7-DcLp37XAs6ppRKkcqfD87MUImbOi6tc2dPqvVQqG-MOpQ2-ccC_EGqrer12HlL5y09LFakcXccR6tx03jmRoaAXx1CuNwTsyqzBz", { notification: {title:"Booking  Cancelled",body: `The rescheduled booking has been cancelled by the user`},data:{booking_id:bookingId,status:"Rescheduled and Cancelled"}})
          } catch (error) {
            
          }

          try {
            const vendorText = `The rescheduled booking has been cancelled by the user`
            OtpService.sendMessage(vendorPhone, vendorText,SMSCONFIG.RESCHEDULE_CANCEL)
          } catch (error) {
            
          }
         
          //TODO: change the text of the uszer text 
        
          //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
          //if required
      }

      static serviceStart = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
        
        // TODO: Add notification data and the route
        try {
          sendNotificationToDevice(userFCM, { notification: {title:"Service started",body: `The service has been started . Rate the salon to help us discover how well your experience went`},data:{booking_id:bookingId,status:"Start"}})
          //TODO: change the text of the uszer text 
        } catch (error) {
          
        }
       
        
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static serviceEnd = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
       // SendEmail.bookingConfirm(userEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route

        try {
          sendNotificationToDevice(userFCM, { notification: {title:"Service end",body: `We hope you enjoyed the Service`},data:{booking_id:bookingId,status:"Completed"}})
          //TODO: change the text of the uszer text 
        } catch (error) {
          console.log(error)
        }
     
        // const userText = `Your booking for ${dateTime} has been accepted by ${salonName}, CHEERS`
        // OtpService.sendMessage(userPhone, userText)
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static vendorCancelled = (user:UserSI,salon:SalonSI,employee:EmployeeSI,booking:BookingSI) => {
      const dateTime = Notify.formatDate(booking)
     try {
      SendEmail.cancelUser(user.email,user.name,salon.name)
     } catch (error) {
       console.log(error)
     }
     
       // TODO: Add notification data and the route

       try {
         sendNotificationToDevice(user.fcm_token, { notification: {title:"Booking Cancelled",body: `Sorry Booking has been cancelled`},data:{booking_id:booking._id,status:""}})
         //TODO: change the text of the uszer text 
       } catch (error) {
         console.log(error)
       }
    
       const userText = `Sorry!,Your booking for ${dateTime} has been cancelled by ${salon.name}`
      //  OtpService.sendMessage(user.phone, userText)
       //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
       //if required
   }

   static userCancelled = (user:UserSI,salon:SalonSI,booking:BookingSI) => {
    const dateTime = Notify.formatDate(booking)
   try {
    SendEmail.cancelVendor(salon.email,user.name,salon.name)
   } catch (error) {
     console.log(error)
   }
   
     // TODO: Add notification data and the route

     try {
       sendNotificationToDevice(user.fcm_token, { notification: {title:"Booking Cancelled",body: `Sorry Booking has been cancelled`},data:{booking_id:booking._id,status:""}})
       //TODO: change the text of the uszer text 
     } catch (error) {
       console.log(error)
     }
  
     const salonText = `Sorry!,Your booking for ${dateTime} has been cancelled by ${user.name}`
   //  OtpService.sendMessage(salon.contact_number, salonText)
     //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
     //if required
 }


     public static getTotalPromo(booking:BookingSI){
      let total=0
      let promo_code
      for(var i=0;i<booking.services.length;i++){
        total =  total+ booking.services[i].service_total_price
            if(booking.services[i].service_discount_code != null){
              promo_code=booking.services[i].service_discount_code
            }else{
              promo_code="N/A"
            }
      }
      total = total + (total * 18/100)
      return {total,promo_code}
    }


    public static formatDate(booking:BookingSI){
      const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
      return bookingTime
    }


}