import { http } from "winston"
import axios from "axios"
import BaseService from "./base.service"
import OtpSI, { OtpI } from "../interfaces/otp.interface"
import mongoose from "../database"
import UserService from "./user.service"
import { UserSI } from "../interfaces/user.interface"
import EmployeeService from "./employee.service"
import EmployeeSI from "../interfaces/employee.interface"

export default class OtpService extends BaseService{

    userService: UserService
    employeeService: EmployeeService
    constructor(model: mongoose.Model<any, any>, userService: UserService, employeeService: EmployeeService) {
        super(model)
        this.userService = userService
        this.employeeService = employeeService
    }

    public async sendOtp(phoneNumber: string, text: string) {
        const url = `http://staticking.org/index.php/smsapi/httpapi/?uname=attire&password=Zattire121&receiver=${phoneNumber}&route=PA&msgtype=1&sender=default&sms=${text}`
        const res = await axios.get(url)
        if(res.status === 200){
            return res.data
        }
        throw Error(`sendOtp status code: ${res.status} and message ${res.data}`)
    }

    public async sendEmployeeOtp(phone: string){
        const emp = await this.employeeService.getOne({phone}) as EmployeeSI
        if(emp === null) throw new Error(`No employee found with this phone number`);
        const otpNumber: string = '1234'// this.getRandomInt(9999, 999).toString()
        const text: string = `Your login otp is ${otpNumber}`
        const otp: OtpI = {
            phone: phone,
            otp: otpNumber,
            user_type: 'Vendor'
        }
        const otpD = await this.post(otp)
        // await this.sendOtp(phoneNumber, text)
        return otpD
    }

    public async sendUserOtp(phone: string){
        const otpNumber: string = '1234' //this.getRandomInt(9999, 999).toString()
        const text: string = `Your otp is ${otpNumber}`
        const otp: OtpI = {
            phone: phone,
            otp: otpNumber,
            user_type: 'User',
            
        }
        const otpD = await this.post(otp)
        // await this.sendOtp(phoneNumber, text)
        return otpD
    }

    public async verifyUserOtp(phone: string, otp: string, userId: string){
        const otpD = await this.model.findOne({phone, otp, verified: false}) as OtpSI
        if(otpD === null) throw new Error(`Phone and otp do not match`)
        otpD.verified = true
        await otpD.save()
        const user = await this.userService.getId(userId) as UserSI
        if(user === null) throw new Error(`User not found to update phone number`)
        user.phone = phone
        await user.save()
        return {otpD, user}
    }

    public async verifyEmployeeOtp(phone: string, otp: string){
        const otpD = await this.getOne({phone, otp, verified: false}) as OtpSI
        if(otpD === null) throw new Error(`Phone and otp do not match`)
        otpD.verified = true
        await otpD.save()
        return otpD
    }

    protected getRandomInt(max: number, min: number): number {
        return Math.floor(Math.random() * Math.floor(max) + min);
    }

}