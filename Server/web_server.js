//import {} from '../Database/schema.js';
import {EventGoDatabase } from '../Database/database.js';
import{GetUserByEmailAndPass, ServerResponse} from './utility.js'
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
expressServer.app().get("/", Root)
function Root(req, res){
    res.send("ROOT endpoint working and reacheable")
}



 /* UTILITY ROUTES */
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
    res.json(response);
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


expressServer.app().get('/confirmation', Confirmation)
async function Confirmation(req, res){
    console.log(req, "/confirmation route:  Confirmation recieved")
    console.log(req.query)

    //Need an access token to identify which user's profile to create
    //let response = await database.eventgo_schema().EventGoUser().Create(req.query)

    //console.log(response, "/confirmation endpoint tracer")
    res.send("Confirmation endpoint reached")
}




                        /*****************************DATABASE ENTITY MANAGEMENT ROUTES****************************/
    

/* USER ACCOUNT ENTITY  ROUTE */
expressServer.app().get('/createUser', CreateUser)
async function CreateUser(req, res){
    let email = req.query.email
    let password = req.query.password
    
    let details = {
        UserID:req.query.userid,
        Address:req.query.address,
        Email:email,
        Password:password
    }

    let response = await database.eventgo_schema().EventGoUser(details).Create();
    if(response != false){console.log("created user successfully"); res.send("created user successfully")}
    else{console.log("couldn't create user"); res.send("couldn't create user")}
}


expressServer.app().get('/deleteUser', DeleteUser)
expressServer.app().get('/deleteUser/EmailAndPass', DeleteUser)
async function DeleteUser(req, res){
    let email = req.query.email
    let password = req.query.password
   
    let user = await database.eventgo_schema().EventGoUser({Email:email, Password:password})
    let success = await user.GetUserByEmailAndPass()
    if(success == false){res.send("No user to delete"); return false}

    let exists = await user.Exists();

    if(exists == true){
        let response = await user.Delete();
        if(response == true){res.send("User deleted")}
        else{res.send("Couldn't delete user")}
        return;
    }
    res.send("User already doesn't exist to delete")
}

expressServer.app().get('/deleteUser/AccessToken', DeleteUserWithAccessToken)
async function DeleteUserWithAccessToken(req, res){
    let access_token = req.query.access_token
    let user_data = await database.supabase_client().auth.getUser(access_token)
   
    user_data = user_data.data.user
    console.log(user_data)
    let user = await database.eventgo_schema().EventGoUser({UserID:user_data.id})
    await user.Synchronize()

    let response = await user.Delete();

    if(response == true){res.send("User deleted")}
    else{res.send("Couldn't delete user")}
}


expressServer.app().get('/updateUser', UpdateUser)
async function UpdateUser(req, res){
    let data = {Email:req.query.email, Password:req.query.pass, Address:req.query.address,  UserID:req.query.userid}
    let success = await database.eventgo_schema().EventGoUser(data).Update()
    if(success){res.send("User updated"); return true;}
    res.send("Couldn't update user")
}



/* BUSINESS ACCOUNT ENTITY ROUTE*/
expressServer.app().post('/createBusiness/EmailAndPass', CreateBusiness)
async function CreateBusiness(req, res){
    //This endpoint creates ALL 3 Entities at same time. It assumes that business and regular account will be 
    //merged together. Note this contraint may not exist in future

    //NOTE: This endpoint must have a check that if same user tries to create same account it will refuse it
    //There probably is a check I just don't know much tbh.
    let success = await database.eventgo_schema().SupaUser(req.body.supa_user).Create();
    if(success == false){res.send("Couldn't signup user"); return false;}

    let user_data = await GetUserByEmailAndPass(req.body.supa_user.email, req.body.supa_user.password)
    req.body.eventgo_user.userid = user_data.id
    let eventgo = req.body.eventgo_user
    let data = {Email:eventgo.email, Password:eventgo.password, Address:eventgo.address,  UserID:eventgo.userid}

    let busi = req.body.business
    busi.ID = eventgo.userid

    let success1 = await database.eventgo_schema().EventGoUser(data).Create();
    let success2 = await database.eventgo_schema().Business(req.body.business).Create();

    res.send(String(success + success1 + success2)+" entities created")

}

expressServer.app().post('/createBusiness/LinkToAccount', LinkAndCreateBusiness)
async function LinkAndCreateBusiness(req, res){
    let business_body = req.body.business
    let user = req.body.user
    business_body.ID = user.ID

    //Check if the user exists in either tables
    let User = await database.eventgo_schema().SupaUser(user)
    let user_exists = await User.Exists();
    if(user_exists == false){res.send("User doesn't exist in database"); return false}

    //Check if the business account exists already
    let business_acc = await database.eventgo_schema().Business(business_body)
    let exists = await business_acc.Exists();
    if(exists == true){res.send("Business Profile already exists"); return}
    
    //Link the account here by creating new business account with same UUID
    business_acc.SetAttributes(business_body);
    let created = await business_acc.Create();  
    if(created == false){res.send("Couldn't create business profile for linking"); return false}
    res.send("Business profiled created and linked")
}   

expressServer.app().post('/deleteBusiness', DeleteBusiness)
async function DeleteBusiness(req, res){
    let business_body = req.body.business

    //Check if the business account exists already
    let business_acc = await database.eventgo_schema().Business(business_body)
    let exists = await business_acc.Exists();
    if(exists == false){res.send("Business Profile already doesn't exist"); return}
    
    //Delete the account here
    business_acc.SetAttributes(business_body);
    let deleted = await business_acc.Delete();  
    if(deleted == false){res.send("Couldn't delete business profile"); return false}
    res.send("Business profiled deleted")
}   


expressServer.app().post('/UpdateBusiness', UpdateBusiness)
async function UpdateBusiness(req, res){
    let business_body = req.body.business

    //Check if the business account exists already
    let business_acc = await database.eventgo_schema().Business(business_body)
    let exists = await business_acc.Exists();
    if(exists == false){res.send("Business Profile doesn't exist"); return}
    
    //Update the account here by same UUID
    business_acc.SetAttributes(business_body);
    let updated = await business_acc.Update();  
    if(updated == false){res.send("Couldn't update business profile"); return false}
    res.send("Business profiled updated")
} 



/* TICKET ENTITY ROUTE */
expressServer.app().get('/createTicket', CreateTicket)
async function CreateTicket(req, res){
    let show = await database.eventgo_schema().Show(req.body.show)
    let success = await show.Synchronize();

    if(success == false){
        let exists = await show.Exists();
        if(exists == false){res.send("In order to create ticket A Show needs to be hosted"); return false}
    }

    let ticket = await show.Ticket(req.body.ticket)
    let ticket_success = await ticket.Create();

    if(ticket_success == true){res.send("Ticket created successfullyy"); return true}
    res.send("Couldn't Create ticket")
    return false;
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


/* SHOW ENTITY ROUTE */
expressServer.app().get('/createShow', CreateShow)
async function CreateShow(){
    //Create business object
    let business = await database.eventgo_schema().Business(req.body.business)
    let busi_exists = await business.Exists();

    //If business account doesn't exist then don't proceed further
    if(busi_exists == false){res.send("Business Account is required to create or host shows"); return false;}

    //Synchronize data between object and the database entry
    let synced = await business.Synchronize()
    console.log("EventGoBusiness Object synchronized")

    //Create show object 
    let show = await database.eventgo_schema().Show(req.body.show)
    let show_exists = await show.Exists();

    //If show already doesn't exist then create the show
    let success = null
    if(show_exists == false){success = await show.Create();}

    else{res.send("Show already exists")}

    if(success){res.send("Show has been created"); console.log("Show has been created"); return true}
    res.send("Couldn't create show");
    console.log("Couldn't create show")

    return false;
}


/* TRANSACTION ENTITY ROUTE */



/*****Starting the Webserver******/
expressServer.start();