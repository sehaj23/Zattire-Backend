import mongoose from "../database";
import CartI, { CartOption, CartSI } from "../interfaces/cart.interface";
import SalonSI from "../interfaces/salon.interface";
import { CartRedis } from "../redis/index.redis";
import BaseService from "./base.service";

export default class CartService extends BaseService {

    salonModel: mongoose.Model<any, any>
    constructor(cartModel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>) {
        super(cartModel)
        this.salonModel = salonModel
    }

    bookCartByUserId: (userId: string) => Promise<CartSI> = async (userId: string) => {
        const cart = await this.getCartByUserId(userId)
        cart.status= 'Booked'
        await cart.save()
        return cart
    }

    getSalonByOptionId : (optionId: string) => Promise<SalonSI> = async (optionId: string) => {
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionId) }) as SalonSI
        if (salon === null || !salon) throw new Error("getSalonByOptionId - Salon not found")
        return salon
    }

    getPriceByOptionId: (optionId: string) => Promise<{price:number,service_name:string,option_name,category_name:string}> = async (optionId: string) => {
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionId) }) as SalonSI
        if (salon === null || !salon) throw new Error("Salon not found")
        for (let service of salon.services) {
            for (let option of service.options) {
                if (option._id.toString() === optionId){
                return {price:option.price.valueOf(),service_name:service.name,option_name:option.option_name,category_name:service.category}
            }
        }
        }
        throw new Error("Option not found")
    }

    getPriceAndNameByOptionId: (optionId: string) => Promise<{ name: string, price: number,service_name:string }> = async (optionId: string) => {
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionId) }) as SalonSI
        if (salon === null || !salon) throw new Error("Salon not found")
        for (let service of salon.services) {
            for (let option of service.options) {
                if (option._id.toString() === optionId) return {
                    name: option.option_name.valueOf(),
                    price: option.price.valueOf(),
                    service_name:service.name.valueOf()
            
                }
            }
        }
        throw new Error("Option not found")
    }

    getCategoriesByOptionIds: (optionIds: string[]) => Promise<string[]> = async (optionIds: string[]) => {
        const categories = []
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionIds[0]) }) as SalonSI
        if (salon === null || !salon) throw new Error("Salon not found")
        for (let service of salon.services) {
            for (let option of service.options) {
                if (optionIds.includes(option._id.toString())) categories.push(service.category)
            }
        }
        return categories
    }

    /**
     * This is to add an option id to an exsisting cart
     */
    addOptionToCart = async (cartId: string, option_id: string) => {

        const cart = await this.getId(cartId) as CartSI
        const { options } = cart
        // const exist = await this.model.findOne({"options.option_id": option_id, "user_id": userId}
        let optionFound = false
        const optionPrice = await this.getPriceByOptionId(option_id)
        for (let i = 0; i < options.length; i++) {
            const option = options[i]
            if (option.option_id === option_id) {
                option.quantity += 1
                optionFound = true
                break
            }
        }
        if (optionFound === false) {
            cart.options.push({
                option_id,
                quantity: 1,
                service_name:optionPrice.service_name,
                category_name:optionPrice.category_name,
                option_name:optionPrice.option_name

                
            })
        }
        // getting the price of the by option id
       
        const newPrice = cart.total + optionPrice.price
        cart.total = newPrice
        return await cart.save()
    }

    /**
     * This is the function to delete the option from the cart
     */

    deleteOptionFromCart = async (userId: string, optionId: string) => {
        const cart = await this.model.findOne({ "options.option_id": optionId, "user_id": userId }).sort({ "createdAt": -1 }).limit(1) as CartSI
        if (cart === null) throw new Error("Cart not found")
        const { options } = cart
        for (let i = 0; i < options.length; i++) {
            const option = options[i]
            if (option.option_id === optionId) {
                const optionPrice = await this.getPriceByOptionId(optionId)
                const amntToMinus = optionPrice.price * option.quantity
                cart.total -= amntToMinus
                cart.options.splice(i, 1)
                if (cart.options.length === 0) {
                    await cart.remove()
                    return null
                }
                else await cart.save()
                return cart
            }
        }
        throw new Error("Error while deleteing the id. Check cart id and option id")
    }

    /**
     * This is the function to delete the option from the cart
     */

    updateCartOption = async (userId, optionId: string, qty: number) => {
        if (qty === 0) return this.deleteOptionFromCart(userId, optionId)
        const cart = await this.model.findOne({ "options.option_id": optionId, "user_id": userId }).sort({ "createdAt": -1 }).limit(1) as CartSI
        if (cart === null) throw new Error("Cart not found")
        for (let option of cart.options) {
            if (option.option_id === optionId) {
                const optionPrice = await this.getPriceByOptionId(optionId)

                if (option.quantity < qty) {
                    cart.total += optionPrice.price
                } else if (option.quantity > qty) {
                    cart.total -= optionPrice.price
                }
                option.quantity = qty,
                option.service_name=optionPrice.service_name
                break
            }
        }
        await cart.save()
        return cart
    }

    protected getCartByUserId = async (userId: string) => {
        const cart = await this.model.findOne({ user_id: userId }).sort({ "createdAt": -1 }).limit(1) as CartSI
        if(cart === null || !cart) throw Error(`Cart not found for user with id ${userId}`)
        return cart
    }
    // getLastCartByUserId = async (userId: string) => {
    //     const cart = await this.model.findOne({ user_id: userId,status:"In use"}).sort({ "createdAt": -1 }).limit(1) as CartSI
    //     console.log(cart)
    //     if(cart != null){
    //         cart.status='Abandoned'
    //         console.log(cart)
    //        await cart.save()
           
    //     }
    //  }

    /**
     * Getting the cart by user id
     */
    getCartByUserIdLean = async (userId: string, last: boolean = false) => {

        // if(!last){ 
        //  const cart = await this.model.find({"user_id": userId}) as CartSI
        //  }
        const redisCart = await CartRedis.get(userId)
        if(redisCart === null){
            const cart = await this.model.find({ user_id: userId }).sort({ "createdAt": -1 }).limit(1).lean() as any[]
            if (cart.length > 0) {
                for (let cc of cart) {
                    if(cc.status === 'Booked') return []
                    for (let c of cc.options) {
                        const { name, price,service_name } = await this.getPriceAndNameByOptionId(c.option_id)
                        c.option_name = name
                        c.price = price
                        c.service_name=service_name
                    }
                }
            }
            CartRedis.set(userId, cart)
            return cart
        }
        return JSON.parse(redisCart)
    }

    createCart = async (userId: string, salonId: string, optionId: string) => {
      
      //  await this.getLastCartByUserId(userId)
        
        const optionPrice = await this.getPriceByOptionId(optionId)

        const cart: CartI = {
            user_id: userId,
            salon_id: salonId,
            options: [{ option_id: optionId, quantity: 1 ,service_name:optionPrice.service_name,option_name:optionPrice.option_name,category_name:optionPrice.category_name}],
            total: optionPrice.price
        }

        return this.model.create(cart)
    }

    createCartWithMultipleOptions = async (userId: string, salonId: string, options: CartOption[]) => {

      //  await this.getLastCartByUserId(userId)
        let total = 0
        for(let opt of options){
            const optionPrice = await this.getPriceByOptionId(opt.option_id)
            total += optionPrice.price * opt.quantity
        }

        const cart: CartI = {
            user_id: userId,
            salon_id: salonId,
            options: options,
            
            total
        }

        return this.model.create(cart)
    }

    deleteCartByUserId = async (userId: string) => {
        try{
            const cart: CartSI = await this.getCartByUserId(userId)
            await cart.remove()
            return null
        }catch(e){
            throw e
        }
    }

}