import express from 'express';
import {User, EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from './schema.js';

const app = express();

function CreateUser(params){
    let user = new User();
    user.SetAttributes(params)
    let response = user.Create();
    if(response == EntityCreated){
        return true;
    }
    return false;
}

function DeleteUser(params){
    let user = new User();
    user.SetAttributes(params)
    let response = user.Delete()
    if(response == EntityDeleted){return true;}
    return false;
}

app.get('/CreateUser', (req, res)=>{
    let value = CreateUser(req.query);
    if(value){res.send("User created successfully")}
    else{
        res.send(value)
    }
})  

app.get('/DeleteUser', (req, res)=>{
    let value = DeleteUser(req.query);
    if(value){res.send("Deleted user successfully")}
    else{
        res.send(value)
    }
})

app.get('/', (req, res)=>{
    res.send("Root URL is working...")
})
app.get('/TestUserData', (req, res)=>{
    let resp = {
        'UserID': 12387123124,
        'CreatedAt':"12/12/2024 09:34:23 PM",
        'Address':"456 theodore street, San Marcos, CA 91919",
        'Email':"fake@mail.com",
        'DateJoined':'12/12/2024',
        'Logged':false,
        'CredentialID':12931233
    }
    res.json(resp);
})

app.listen(8888, ()=>{console.log("server is running.....")})




