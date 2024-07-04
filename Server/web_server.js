import 'dotenv/config'
import * as RouteHandlers from "./Handlers/handlers.js"
import { expressServer } from "./server_tools.js";



const PORT = 8888
const CORS = false;

expressServer.use_cors(CORS)
expressServer.set_port(PORT)
expressServer.start()