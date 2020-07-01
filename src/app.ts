import * as express from "express";
import * as bobyParser from "body-parser";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import router from "./routes/AdminRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes"
import VendorApprouter from "./routes/VendorAppRoutes/index.routes"
import * as aws from "aws-sdk";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import NewVendor from "./models/newVendor.model";
import logger from "./utils/logger";
import * as cors from "cors";
import startSocketIO from "./service/socketio";
import Admin from './models/admin.model'
import { AdminRedis } from "./redis/index.redis";

const app = express();
app.use(cors());

export const http = require('http').createServer(app);

export const io: SocketIO.Server = require("socket.io")(http, {
  path: "/ws"
});

startSocketIO(io)



const spacesEndpoint = new aws.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new aws.S3({
  //@ts-ignore
  endpoint: spacesEndpoint,
  accessKeyId: "DQC6AT6WECGTVTPBMEPW",
  secretAccessKey: "1aG2MQPG1CBJS01q/y6pjLwRVNgzPwfkNkvWa3XCrp8",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "zattire",
    acl: "public-read",
    key: function (request, file, cb) {
      console.log(file);
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("upload", 1);

// TODO : Change to AWS
app.post("/upload", function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      return response.send(`/error/${error}`);
    }
    console.log("File uploaded successfully.");
    const location = request.files[0].location
    response.send({
      location,
      success: true
    });
  });
});


dotenv.config();

const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });


// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(
  morgan(
    ":remote-addr - :method :url :status :res[content-length] - :response-time ms"
  )
);

app.use(express.json());

app.use("/api", router);
app.use("/api/v/",Vendorrouter)
app.use("/api/vendorapp/",VendorApprouter)

// this is only for redis
app.get("/r/s", async (req: express.Request, res: express.Response) => {
  try{
    const s = await Admin.find()
    res.send(s)
  }catch(e){
    logger.error(e)
    res.status(400).send(e)
  }
})

const adminId = "5efa3d3af9212b04a31b5d33"
app.get("/r/s/:id", async (req: express.Request, res: express.Response) => {
  try{  
    const id = req.params.id || adminId
    const ar: string =  await AdminRedis.get(id)
    console.log(ar)
    if(ar !== null){
      return res.send(JSON.parse(ar))
    }
    
    const s = await Admin.findById(id)
    AdminRedis.set(id, s)
    res.send(s)
  }catch(e){
    logger.error(e)
    res.status(400).send(e)
  }
})

/**
 * Note:
 * In update(put / patch) we will remove the data from the redis
 */

app.put("/r/s/:id", async (req: express.Request, res: express.Response) => {
  try{  
    const id = req.params.id || adminId
    // Removing
    AdminRedis.remove(id)
    const s = await Admin.findById(id)
    res.send(s)
  }catch(e){
    logger.error(e)
    res.status(400).send(e)
  }
})


app.get("/", (req, res) =>{
  res.send("hello from the backend")
})

// this is for 404
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.name = "404";
  res.status(404);
  res.send(err);
});


export default app
