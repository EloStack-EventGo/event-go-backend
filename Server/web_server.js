import express from 'express';
import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from '../Database/schema.js';
import { EventGoDatabase } from '../Database/database.js';
import {ExpressServer} from './express_app.js';

const database = new EventGoDatabase()
const expressServer = new ExpressServer();
expressServer.use_cors(false);
expressServer.set_port(8888)

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
    user_login(req, res){
        database.login(req.query)
    }

    //Route for sign up
    user_signup(req, res){
        database.signup(req.query)
    }

    //Route for sign ou
    user_signout(req, res){
        database.signout(req.query)
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