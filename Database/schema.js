import { createClient } from '@supabase/supabase-js';
import {SUPA_URL, SUPA_ANON_KEY, SUPA_SERVICE_KEY} from './credentials.js';
import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from './status_codes.js';
import { Flag, UserSession} from './utilities.js';

export const supabaseClient = createClient(SUPA_URL, SUPA_ANON_KEY)
export const supabaseAdminClient = createClient(SUPA_URL, SUPA_SERVICE_KEY)

export class BaseEntity{
    constructor(){
        this.attributes = null
    }
    SetAttributes(attributes){this.attributes = attributes}
    Attributes(){return this.attributes}
    Exists(){}
    Update(){}
    Create(){}
    Delete(){}
    Search(){}
}

export class Transaction extends BaseEntity{

    constructor(attributes=null){
        this.attributes = attributes
        if(attributes === null){
            this.attributes = {
                ID:null,
                CreatedAt:null,
                PaymentBy:null,
                PaymentTo:null,
                TimeAndDate:null,
                Amount:null,
                Currency:null,
                PaymentType:null
            }
        }
    }

    async Create(){
        let {data, error} = await supabaseAdminClient.from('Transactions').insert(this.attributes)
        console.log(data, error, "Class Transaction: Create() tracer")
        if(data){return true}
        else if(error){return false}
    }

    async Delete(){
        let {data, error} = await supabaseAdminClient.from('Transactions').delete().eq('ID', this.attributes.ID)
        console.log(data, error, "Class Transaction: Delete() tracer")
        if(data){return true}
        else if(error){return false}
    }
}

export class Ticket extends BaseEntity{

    constructor(attributes=null){
        super();
        this.attributes = attributes
        if(attributes === null){
            this.attributes = {
                ID:null,
                CreatedAt:null,
                Price:null,
                Onsale:null,
                Refundable:null,
                Confirmed:null,
                BusinessOwnerID:null,
                CustomerID:null,
                ShowName:null
            }
        }
        console.log(this.attributes, " CLass Ticket:")
    }

    SetAttributes(attributes){
        this.attributes = this.attributes
    }

    async GenerateTransaction(attributes){
        attributes.ID = this.attributes.ID
        attributes.PaymentBy = this.attributes.CustomerID
        attributes.PaymentTo = this.attributes.BusinessOwnerID
        this.Amount = this.Price
        let transaction = new Transaction(attributes)
        var success = transaction.Create();

    }
    
    async Create(){
        let{data, error} = await supabaseAdminClient.schema('public').from('Tickets').insert(this.attributes)
        console.log(data, error)
    }

    async Delete(){
        let{data, error} = await supabaseAdminClient.fron('Tickets').delete().eq('ID', this.attributes.ID)
        console.log(data, error)
    }
    async Update(){}
    Attributes(){return this.attributes}
}


export class Show extends BaseEntity{

    constructor(attributes=null){
        super();
        this.attributes = attributes
        if(attributes === null){
            this.attributes = {
                ID:null,
                CreatedAt:null,
                ShowName:null,
                HostDate:null,
                EndDate:null,
                StartTime:null,
                EndTime:null,
                Venue:null,
                BusinessOwner:null,
                SeatsArranged:null,
                Category:null,
                ShowType:null,
                HostedBy:null
            }
        }
    }

    async Create(){
        let {data, error} = await supabaseAdminClient.from('Shows').insert(this.attributes)
        console.log(data, error, "Class Show: Create() Tracer")
        if(data){return true}
        else if(error){return false}
    }

    async Delete(){
        let {data, error} = await supabaseAdminClient.from('Shows').delete().eq('ID', this.attributes.ID)
        console.log(data, error, "Class Show: Delete() tracer")
        if(data){return true}
        else if(error){return false}
    }

    async GetAvailableTicket(){}

    async CreateTicket(attributes){
        attributes.ID = this.attributes.ID
        attributes.PaymentTo = this.attributes.ID
        attributes.Onsale = true;
        attributes.Refundable = false;
        var ticket = new Ticket(attributes)
        let success = ticket.Create();

        if(success != false){}
    }

    async SellTicket(){}

    Update(){}
    Search(){}
    Attributes(){return this.attributes}
}

export class EventGoBusiness extends BaseEntity{

    constructor(attributes=null){
        super();
        this.attributes = attributes;
        if(attributes == null){
            this.attributes = {
                ID:null,
                Name:null,
                Address:null,
                NetProfit:null,
                SupabaseUserID:null
            }
        }
    }

    SetAttributes(){}
    Attributes(){}
    async CreateShow(attributes){
        attributes.ID = this.attributes.ID
        let show = new Show(attributes)
        let response = await show.Create()
    }

    UpdateProfile(){}
    GetNetProfit(){}
    GetName(){}
    GetAddress(){}
}


export class SupabaseUser extends BaseEntity{
        constructor(attributes=null){
            super();
            this.attributes = attributes
            this.user_session = null;
            this.redirect_url = null;
            if(this.attributes !== null){
                this.attributes={
                    email:attributes['email'], password:attributes['password'],
                }
            }
            
            else{
                console.log("supabase useR: else")
                this.attributes={
                    email:null,
                    password:null,
                }
            }
        }
    
    async Create(){
        console.log(this.attributes, "Sign Up attributes")
        //REDIRECT URL FOR THE BACKEND SERVER
        //NOTE: Need to change things, because URL shouldn't be specified in here but in web_server.js
        const attributes = {
            ...this.attributes,
            options: {
                //emailRedirectTo: 'http://38.56.129.131:9999/-domain.com/confirmation' // Replace with your actual URL
            }    
        }
        const{data, error} = await supabaseClient.auth.signUp(this.attributes)
        console.log(data, error, "Class SupabaseUser: Create()")
        
        if(data !== undefined){
            if((data['user'] == null)){console.log("no user created");return false;}
            else{ console.log("created user "); 
                this.user_session = data
                return data;}
        }
        else if(error !== undefined){console.log(error); return false}
    }


    //Delete using Anon key
    async Delete(){}
    async SignOut(){}
    async Login(){}
    RedirectURL(url){
        this.redirect_url = url
    }
    Authenticated(){if(this.session !== null){
        return this.user_session.user.user_metadata.email_verified
    }
    return this.user_session}
}


export class EventGoUser{

    constructor(attributes=null){

        this._supabase_user = null;
        this.list = ['UserID', 'Address', 'Email', 'SupabaseUserID', 'Password']

        if(attributes !== null){
            this.attributes = attributes
        }
        else{
            this.attributes = {
                'UserID':null,
                'Address':null,
                'Email':null,
                'SupabaseUserID':null,
                'Password':null
            }
        }
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
        //Since someone wants to create user with specific user id we will run this
        //if(this.__verify_attributes(this.attributes) == false){return EntityNotCreated}
        const{data, error} = await supabaseClient.from('EventGoUsers').insert(this.attributes)
        if(data){
            console.log("Yes", data)
            return EntityCreated
        }
        else if(error){
            console.log("No", error)
            return EntityNotCreated
        }
    }

    async Delete(){
        //Delete the object in the database
        if(this.__verify_attributes(this.attributes) == false){return EntityNotDeleted}
        const {data, error} = await supabaseClient.from('Users').delete().eq('UserID', this.attributes['UserID'])
        if(data){
            console.log(data)
            return EntityDeleted}
        else if(error){
            console.log(error)
            return EntityNotDeleted}
    }

    Attributes(){return this.attributes}
    async BuyTicket(BusinessID){
        let{data, error} = await supabaseAdminClient.from('Tickets').select('ID').eq('ID', BusinessID)
        //After getting the data modify values
        data.PaymentBy = this.attributes.ID
        data.Onsale = false;
        data.Confirmed = true;
        var ticket = new Ticket(data)
        var success = await ticket.Update()
    }
}

export class CombinedUser{
    //NOTE: Maybe change name from combined to 'EventGo' since it is better
    constructor(attributes=null){
        this.attributes = attributes
        this._supabase_user = new SupabaseUser(this.attributes)
        this._eventgo_user = new EventGoUser(this.attributes)
        this._ready = new Flag(true);

        if(attributes == null){this._ready.set_false();}
    }
    __verify_attributes(){
        return this._ready.check();
    }
    
    SetAttributes(attributes){
        this.attributes = attributes
        if(this.attributes !== null){this._ready.set_true();}
        this._ready.set_false()
    }

    SupaUser(){return this._supabase_user}
    EventGoUser(){return this._eventgo_user}

    async SignOut(){
        if(this.__verify_attributes() == false){return false}
        this.SupaUser().SignOut();
    }

    async SignUp(){
        if(this.__verify_attributes() == false){return false}
        let response = await this._supabase_user.Create();
        console.log(response, "Class CombinedUser: Trace response")
        if(response !== false){
            //check if the user email is verified or not
            if(this._supabase_user.Authenticated() === false){
                let attributes = {
                    Address:null,
                    Email:response['user']['email'],
                    SupabaseUserID:response['user']['id'],
                    Password:response['user']['password']
                }
                this._eventgo_user.SetAttributes(attributes)
                let response = await this._eventgo_user.Create();
                if(response == EntityCreated){return EntityCreated}
                else{console.log(EntityNotCreated);return false}
            }

            else{
                console.log(response)
                return false
            }
        }
        console.log('Supabase user couldnt be created')
        return false
    }

    async Login(){
        let{data, error} = await supabaseClient.auth.signInWithPassword({
            email:this.attributes['email'],
            password:this.attributes['password']
        })

        console.log(data, error)
        if(data !== undefined){
            if(data['user'] == null) return false;
            //If session is valid
            if(data['session'] == null){
                return data;
            }
            //If session is invalid but account is authenticated
            else if(data['session'] !== null){
                return data
            }
            //Add some code to handle in case accoutn doesn't exist
        }
        else if(error !== undefined){
            return false;
        }
    }
}

//export {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted}