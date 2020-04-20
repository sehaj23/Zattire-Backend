import { Router } from "express";
import verifyToken from "../middleware/jwt";
import MakeupartistServiceC from "../service/makeupartist.service"

const makeupArtistRouter = Router()
makeupArtistRouter.get("/", verifyToken, MakeupartistServiceC.get)
makeupArtistRouter.get("/:id", verifyToken, MakeupartistServiceC.getId)
makeupArtistRouter.post("/", verifyToken, MakeupartistServiceC.post)
makeupArtistRouter.put("/:id", verifyToken, MakeupartistServiceC.put)
makeupArtistRouter.post("/event", verifyToken, MakeupartistServiceC.addMakeupArtistEvent)
makeupArtistRouter.put("/:id/photo", verifyToken, MakeupartistServiceC.putPhoto)
makeupArtistRouter.get("/:id/photo", verifyToken, MakeupartistServiceC.getPhoto)

export default makeupArtistRouter
