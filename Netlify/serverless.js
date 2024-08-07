import { expressServer } from "../Server/server_tools.js";
import { Access, Authenticator, Payment, EventGo} from "../Server/Handlers/handlers.js";
import { serverless } from "serverless-http"
//import 'dotenv/config'
require('dotenv').config(); //for netlify

//Sets app to use router1
expressServer.router('router1')
expressServer.update_router('router1', {router_url:"/Backend/Netlify/serverless"})
expressServer.use_cors(false);
module.exports.handler=serverless(expressServer.app())

