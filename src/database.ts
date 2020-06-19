import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { Mockgoose } from "mockgoose"
import Env from "./env";

dotenv.config();

let db = process.env.DB_NAME ?? "zattire"
if(process.env.NODE_ENV === "test")
  db += "_test"
console.log(`Connecting to database: ${db}`)

const user: string = process.env.DB_USER ?? "zattire_dev";
const password: string = process.env.DB_PASS ?? "zattire_dev_password";


let uri: string 
if(process.env.DB_URI){
  uri = `${process.env.DB_URI}/${db}`
}else{
  uri = `mongodb+srv://${user}:${password}@dev-8kbli.mongodb.net/${db}?retryWrites=true&w=majority` 
}
console.log(uri)
export const connectt = () => {
  return new Promise(function (fulfill, reject){
    return mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        poolSize: 10,
        useFindAndModify: true
      },
      (err: any) => {
        if (err) {
          reject(err)
        } else {
          console.log("Successfully Connected!");
          fulfill()
        }
      }
    );
  })
}

export const disconnect = ()  => {
  if(process.env.NODE_ENV === "test"){
    return mongoose.connection.db.dropDatabase().then(() => {
      return mongoose.disconnect()
    })
  }else{
    return mongoose.disconnect()
  }
}

export default mongoose;
