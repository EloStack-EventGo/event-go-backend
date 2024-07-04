import{ GetUserByEmailAndPass, GetUserSessionByEmailAndPass, ServerResponse } from './utility.js'
import { EventGoDatabase } from '../Database/database.js';

import { ExpressServer } from './express_app.js';

//Database instance for EventGo database
const database = new EventGoDatabase()
const expressServer = new ExpressServer()

export {database, EventGoDatabase, expressServer, GetUserByEmailAndPass, GetUserSessionByEmailAndPass, ServerResponse}