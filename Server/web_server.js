import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from '../Database/schema.js';
import {EventGoDatabase } from '../Database/database.js';
import{ServerResponse} from './utility.js'
import {ExpressServer} from './express_app.js';

//Database instance for EventGo database
const database = new EventGoDatabase()
const expressServer = new ExpressServer()
expressServer.use_cors(false); expressServer.set_port(80)


class EventGoServer{

    constructor(){
        //NOTE: If you remove a function then make sure to remove route as well
        expressServer.app().get('/', this.root)
        expressServer.app().get('/login', this.user_login)
        expressServer.app().get('/signup', this.user_signup)
        expressServer.app().get('/hostshow', this.create_show)
        expressServer.app().get('/confirmation', this.confirmation)
    }

    root(req, res){
        res.send("root is working...")
    }

    start(){
        console.log("EventGoServer has started...")
        expressServer.start()
    }

    //URL route for login
    async user_login(req, res){
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


    //Route for sign up
    async user_signup(req, res){
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

    //Route for sign ou
    user_signout(req, res){
        let response = database.signout(req.query)
    }

    //Route for creatin show
    create_show(req, res){}

    //Confirmation
    confirmation(req, res){
        console.log(req, "Class EventGoServer:  Confirmation recieved")
        let data = {

        }
        res.send("Confirmation endpoint reached")
        /*
        //Verify the data before creating EventGoUser object in the table
        let respponse = database.eventgo_schema().EventGoUser(data).Create();

        if(respone == EntityCreated){
            const resp = ServerResponse(response)
            resp.set_success('Successfully confirmed user and created user schema')
            return res.send(resp.get())
        }
            */
    }
}


const EVG = new EventGoServer();
EVG.start();