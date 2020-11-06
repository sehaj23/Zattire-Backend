
import mongoose from '../database'
import BaseService from '../service/base.service'
import OtpService from './otp.service'
import UserService from './user.service'
import encryptData from '../utils/password-hash'

export default class LoginService extends BaseService {
  // Signup
  create = async (user) => {
    const gotAdmin = await this.model.create(user)
    gotAdmin.password = ''
    return gotAdmin
  }

  // Login
  login = async (email: string, password: string) => {
    // this.model is coming from the base service class
    console.log(this.modelName)
    return await this.model.findOne({ email, password })
  }

  getByEmail = async (email: string) => {
    return await this.model.findOne({ email })
  }

  getbyUID = async (uid: string,email:string) => {
    return await this.model.findOne({uid:uid,email:email })
  }



}
