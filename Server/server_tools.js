import{ GetUserByEmailAndPass, GetUserSessionByEmailAndPass, ServerResponse } from './utility.js'
import { EventGoDatabase } from '../Database/database.js';

import { ExpressServer } from './express_app.js';

//Database instance for EventGo database
const database = new EventGoDatabase()
const expressServer = new ExpressServer()
expressServer.use_cors(false); expressServer.set_port(8888)

export {database, EventGoDatabase, expressServer, GetUserByEmailAndPass, GetUserSessionByEmailAndPass, ServerResponse}