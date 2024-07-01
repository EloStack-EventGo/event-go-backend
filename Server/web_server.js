//import {} from '../Database/schema.js';
import {EventGoDatabase } from '../Database/database.js';
import{ServerResponse} from './utility.js'
import {ExpressServer} from './express_app.js';

//Database instance for EventGo database
const database = new EventGoDatabase()
const expressServer = new ExpressServer()
expressServer.use_cors(false); expressServer.set_port(8888)


/*********************************************************************WEB SERVER UTILITIES**************************************************************************/
let SIGNUP_QUEUE = []
function CheckEmailAndPass(email, pass){
    let email_val = (email != undefined && email != null)
    let pass_val = (pass != undefined && pass != null)
    return (email_val && pass_val)
}


/*********************************************************************EVENT GO WEB SERVER FUNCTIONS*****************************************************************/
expressServer.app().get("/login", Login)
async function Login(req, res){    
    let response = await database.supabase_client().auth.signInWithPassword(req.query)

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


expressServer.app().get('/signup', SignUp)
async function SignUp(req, res){

    //Check if the email and password are correct
    if(CheckEmailAndPass(req.query.email, req.query.password) == false){
        res.send("Email and Password don't match backend criterion. Values either undefined or null")
        return false;
    }

    //Create the user in auth.users table by creating new SupaUser() objcet
    let response = await database.eventgo_schema().SupaUser(req.query).Create();
    console.log(response, "server route signup")
    
    //If the creation response was not successfull in creating
    if(response === false){
        let server_resp = new ServerResponse(null)
        server_resp.set_not_sucess('SignUp unsuccessful')
        res.json(server_resp.get())
        return false;
    }

    //If the creation of user in auth.users table was successful
    let server_resp = new ServerResponse(response['user'])
    server_resp.set_success('SignUp Successfull')
    res.json(server_resp.get())
}


expressServer.app().get('/createUser', CreateUser)
async function CreateUser(req, res){
    let email = req.query.email
    let password = req.query.password
    
    let details = {
        UserID:req.query.userid,
        Address:req.query.address,
        Email:email,
        SupabaseUserID:req.query.supabaseuserid,
        Password:password
    }

    let response = await database.eventgo_schema().EventGoUser(details).Create();

    console.log(response)
    if(response != false){console.log("created user successfully"); res.send("created user successfully")}
    else{console.log("couldn't create user"); res.send("couldn't create user")}
}

expressServer.app().get('/confirmation', Confirmation)
async function Confirmation(req, res){
    console.log(req, "/confirmation route:  Confirmation recieved")
    console.log(req.query)

    //Need an access token to identify which user's profile to create
    //let response = await database.eventgo_schema().EventGoUser().Create(req.query)

    //console.log(response, "/confirmation endpoint tracer")
    res.send("Confirmation endpoint reached")
}


expressServer.app().get('/createEvent', HostShow)
function HostShow(req, res){
    res.send("Endpoint works but no functionality yet")
}

expressServer.app().get("/createTicket", CreateTicket)
async function CreateTicket(req, res){
}

expressServer.app().get("/buyTicket", BuyTicket)
async function BuyTicket(){
    let access_token = req.query['access_token']
    let response = await database.supabase_client().auth.signInWithPassword(req.query)

    if(access_token != undefined && access_token != null && response != undefined && response != null){

        //Get the user and create the ticket now
        let user_data = await database.supabase_client().auth.getUser(access_token)
        console.log(user_data, "/createTicket tracer")
        res.send("extracted session and user successfully")

        let details = {
            UserID:req.data.user.id,
            Email:req.data.user.email,
            Password:req.data.user.password,
            Address:req.data.user.Address,
            SupabaseUserID:"random_id"
        }

        //NOTE: Use paramters or body to get the ticket details as well
        let user = await database.eventgo_schema().EventGoUser(details).BuyTicket(req.body.Ticket)
    
        return false;
    }
    res.send("couldn't extract sesion and user")
}


/*****Starting the Webserver******/
expressServer.start();