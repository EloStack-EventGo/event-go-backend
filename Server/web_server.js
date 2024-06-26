import express from 'express';
import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from '../Database/schema.js';
import { EventGoDatabase } from '../Database/database.js';
import {ExpressServer} from './express_app.js';

const database = new EventGoDatabase()
const expressServer = new ExpressServer();
expressServer.use_cors(false);
expressServer.set_port(8888)


class ServerResponse{
    constructor(message){
        this.response = {
            'Error':false,
            'ErrorDetail':null,
            'Response':message,
            'ResponseDetail':null,
        }
    }

    set_response(message){this.response['Response'] = message}
    set_not_sucess(detail){
        this.response['ResponseDetail'] = null
        this.response['Error'] = true;
        this.response['ErrorDetail'] = detail
    }
    set_success(detail){
        this.response['Error'] = false;
        this.response['ErrorDetail'] = null,
        this.response['ResponseDetail'] = detail
    }
    get(){return this.response}
}

class EventGoServer{

    constructor(){
        expressServer.app().get('/', this.root)
        expressServer.app().get('/login', this.user_login)
        expressServer.app().get('/signup', this.user_signup)
        expressServer.app().get('/hostshow', this.create_show)
        expressServer.app().get('/authenticator', this.authenticator)
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
    create_show(req, res){

    }

    //Route for authentication
    authenticator(req, res){

    }
}


const EVG = new EventGoServer();
EVG.start();