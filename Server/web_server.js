//import {} from '../Database/schema.js';
import {EventGoDatabase } from '../Database/database.js';
import{ServerResponse} from './utility.js'
import {ExpressServer} from './express_app.js';

//Database instance for EventGo database
const database = new EventGoDatabase()
const expressServer = new ExpressServer()
expressServer.use_cors(false); expressServer.set_port(8888)



expressServer.app().get("/login")
async function Login(req, res){
    let response = await database.login(req.query)
    console.log(response)
    if(response == false){
        let server_resp = new ServerResponse(null)
        server_resp.set_not_sucess('Login Unsuccessful')
        res.json(server_resp.get())
        return false;
    }

    //If login is successful
    let server_resp = new ServerResponse(response)
    server_resp.set_success('Login Successful')
    res.json(server_resp.get());
}

expressServer.app().get('/signup')
async function SignUp(req, res){
    let response = await database.signup(req.query)
    console.log(response, "server route signup")
    if(response == false){
        let server_resp = new ServerResponse(null)
        server_resp.set_not_sucess('SignUp unsuccessful')
        res.json(server_resp.get())
        return false;
    }

    let server_resp = new ServerResponse(response['user'])
    server_resp.set_response(response['user'])
    server_resp.set_success('SignUp Successfull')
    res.json(server_resp)
}


expressServer.app().get('/createEvent')
function HostShow(req, res){
    res.send("Endpoint works but no functionality yet")
}


expressServer.app().get('/confirmation')
function Confirmation(req, res){
    console.log(req, "Class EventGoServer:  Confirmation recieved")
    console.log(req.query, req.body)
    //database.complete_sign_up()
    res.send("Confirmation endpoint reached")
}