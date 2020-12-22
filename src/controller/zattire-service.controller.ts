import { Request, Response } from 'express'
import BaseController from './base.controller'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import ZattireService from '../service/zattire-service'
import { ServicesI } from '../interfaces/zattire-service.interface'


export default class ZattireServiceController extends BaseController {
  service:ZattireService
  constructor(service: ZattireService) {
    super(service)
    this.service = service

  }

  create = controllerErrorHandler( async (req: Request, res: Response)=>{
    const option = req.body.options 
    const services = await this.service.post(option)
    res.status(201).send({success:true,message:"Services created"})
  })

  addService = controllerErrorHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const services:ServicesI= req.body.services
    const addServices = await this.service.addServiceToCategory(id,services)
    if(!addServices){
      return res.status(400).send({success:false,message:"error updating"})
    }
    res.status(200).send({success:true,message:"Added"})
})

deleteServiceFromCategory =  controllerErrorHandler(async (req: Request, res: Response) => {
  const category_id =  req.params.cid
  const service_id = req.params.sid
  const remove =  await this.service.deleteServiceFromCategory(category_id,service_id)
  if(!remove){
    return res.status(400).send({success:false,message:"error deleting"})
  }
  res.status(200).send({success:true,message:"Deleted"})
})


editServiceFromCategory =  controllerErrorHandler(async (req: Request, res: Response) => {
  const category_id =  req.params.cid
  const service_id = req.params.sid
  const data = req.body
  const edit=  await this.service.editServiceFromCategory(category_id,service_id,data)
  if(!edit){
    return res.status(400).send({success:false,message:"error updating"})
  }
  res.status(200).send({success:true,message:"updated"})
})
}