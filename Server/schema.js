import { createClient } from '@supabase/supabase-js';
//const createClient = require('@supabase/supabase-js').createClient
//import {SUPA_KEY, SUPA_ANON_KEY} from './credentials';
//import StatusCode from './status_codes';
const SUPA_URL = 'https://hhcrpjkcliunjhyvrjna.supabase.co'
const SUPA_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3JwamtjbGl1bmpoeXZyam5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2OTAwMjUsImV4cCI6MjAzNDI2NjAyNX0.30kTdNs_u5CCETTXqjYI93y2wvQl7FDrHEoUCUALw7Q'
const supabase = createClient(SUPA_URL, SUPA_ANON_KEY)

const EntityCreated = 'Entity created successfully'
const EntityDeleted = 'Entity deleted successfully'
const EntityNotDeleted = 'Entity not deleted successfully'
const EntityNotCreated = 'Entity not created successfully'


class Credential{}
class Business{}
class Ticket{}
class Show{}
class Transaction{}

export class User{

    constructor(){
        this.attributes = {
            'UserID':null,
            'CreatedAt':null,
            'Address':null,
            'Email':null,
            'DateJoined':null,
            'Logged':null,
            'CredentialID':null
        }
        this.list = ['UserID', 'CreatedAt', 'Address', 'Email', 'DateJoined', 'Logged', 'CredentialID']
    }

    SetAttributes(json_attr){
        this.attributes = json_attr;
    }

    __verify_attributes(list){
        for(let i = 0; i < list.length; i++){
            try{if(this.attributes[list[i]] == null){return false;}}
            catch(e){}
        }
        return true;
    }
    async Create(){
        //Create the object in the database

        //Ignore the UserID if it's not integer because you'd only have integer if someone explicitly wants to create
        if(typeof this.attributes.UserID !== "number"){
            delete this.attributes.UserID;
            let list = this.list.slice(1, this.list.length)
            if(this.__verify_attributes(list) == false){return EntityNotCreated}
        }

        //Since someone wants to create user with specific user id we will run this
        if(this.__verify_attributes(this.attributes) == false){return EntityNotCreated}
        const{data, error} = await supabase.from('Users').insert(this.attributes)
        if(data){
            console.log("Yes", data)
            return EntityCreated
        }
        else if(error){
            console.log("No", error)
            return EntityNotCreated
        }
    }

    async Exists(){
        const response = await supabase.from('Users').select()
    }
    async Search(){

    }
    async Update(){

    }
    async Delete(){
        //Delete the object in the database
        if(this.__verify_attributes(this.attributes) == false){return EntityNotDeleted}
        const {data, error} = await supabase.from('Users').delete().eq('UserID', this.attributes['UserID'])
        if(data){
            console.log(data)
            return EntityDeleted}
        else if(error){
            console.log(error)
            return EntityNotDeleted}
    }
    ChangeProfile(){}
    VerifyLogin(){}
    CancelTicket(){}
    BuyTicket(){}
    AccessCredentials(){}
}

export {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted}