
import BaseService from '../service/base.service'

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

}
