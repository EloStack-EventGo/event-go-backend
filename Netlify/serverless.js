import { expressServer } from "../Server/server_tools.js";
import { Access, Authenticator, Payment, EventGo} from "../Server/Handlers/handlers.js";
import { serverless } from "serverless-http"


//Sets app to use router1
expressServer.router('router1')
expressServer.use_cors(false)
expressServer.update_router('router1', {router_url:"Backend/Database/Netlify/serverless"})
module.exports.handler=serverless(expressServer.app())

