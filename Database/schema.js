import { createClient } from '@supabase/supabase-js';
import {SUPA_URL, SUPA_ANON_KEY, SUPA_SERVICE_KEY} from './credentials.js';
import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from './status_codes.js';
import {Flag, UserSession} from './utilities.js';

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
    //looks gud
    constructor(attributes=null){
        super();
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
                PaymentType:null,
                TransactionID:null,
            }
        }
    }

    async Create(){
        let {error} = await supabaseAdminClient.from('Transactions').insert(this.attributes)
        console.log(error, "Class Transaction: Create() tracer")
        if(error){console.log("Create():", false);return false}
        else{console.log("Create():", true); return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.from('Transactions').delete().eq('ID', this.attributes.ID)
        console.log(response, "Class Transaction: Delete() tracer")
        if(response.error == null || response.error == undefined){console.log("Delete():", true);return true}
        console.log("Delete()", false)
        return false;
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('Transactions').update(this.attributes).eq('ID', this.attributes.ID)
        console.log(error, "Class Transaction: Update() tracer")
        if(error){console.log("Update():", false); return false;}
        else console.log("Update():", true); return true;
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Transactions').select().eq('ID', this.attributes.ID)
        console.log(error, "Class Transaction: Exists() tracer")
        if(data != null && data != undefined && data.length > 0){console.log("Exists(): ", true); return true}
        else {console.log("Exists():", false); return false}
    }
}


export class Ticket extends BaseEntity{
    //looks good
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
                ShowName:null,
                TicketID:null
            }
        }
        console.log(this.attributes, " CLass Ticket:")
    }
    
    async Transaction(){
        //let value = await this.Exists()
        let attributes = {ID:null, CreatedAt:null, PaymentBy:null, PaymentTo:null, TimeAndDate:null, Amount:null, Currency:null, PaymentType:null}
        attributes.ID = this.attributes.ID
        attributes.PaymentBy = this.attributes.CustomerID
        attributes.PaymentTo = this.attributes.BusinessOwnerID
        attributes.Amount = this.attributes.Price
        console.log(attributes.Amount, this.Price, "Ticket.Transaction()")
        attributes.Currency = "US Dollars"
        attributes.PaymentType = "Credit"
        let transaction = new Transaction(attributes)
        return transaction
    }

    async Create(){
        let{error} = await supabaseAdminClient.schema('public').from('Tickets').insert(this.attributes)
        console.log(error, "Class Ticker Create() tracer");
        if(error){console.log("Create():", false); return false}
        else{console.log("Create():", false); return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.fron('Tickets').delete()
        .eq('ID', this.attributes.ID).eq('TicketID', this.attributes.TicketID)
        console.log(response, "Class Ticker Delete() tracer");
        if(response.error == null || response.error == undefined){console.log("Delete():", true);return true}
        console.log("Delete()", false)
        return false;
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('Tickets').update(this.attributes)
        .eq('ID', this.attributes.ID).eq('TicketID', this.attributes.TicketID)
        console.log(error, "Class Ticker Update() tracer");
        if(error){console.log("Update():", false); return false}
        else{console.log("Update():", true); return true;}
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Tickets').select()
        .eq('ID', this.attributes.ID).eq('TicketID', this.attributes.TicketID)
        console.log(error, "Class Ticker Exists() tracer");
        if(data != null && data != undefined && data.length > 0){console.log("Exists(): ", true); return true}
        else {console.log("Exists():", false); return false}
    }

    async __synchronize_with_database_row(){
        //Synchronizes the attribute in the database within the object. Then same attributes can be accessed
        let{data, error} = await supabaseAdminClient.from('Tickets').select()
        .eq('ID', this.attributes.ID).eq('TicketID', this.attributes.TicketID)
        if(data != undefined && data != null){
            this.attributes = data[0]
            console.log("Ticket successfully synchronized")
            console.log("CURRENT ATTRIBUTES")
            console.log(this.attributes)
            return true;
        }

        console.log("\x1b[31mTicket successfully synchronized\x1b[0m")
        console.log("\x1b[31mMaybe data in database doesn't exist\x1b[0m")
        return false;
    }

    async Synchronize(){
        //Synchronization wrapper for external use
        let success = await this.__synchronize_with_database_row()
        return success;
    }

    async GetAvailableTicket(){
        let{data, error} = await supabaseAdminClient.from('Tickets').select()
        .eq('ID', this.attributes.ID)
        .eq('Onsale', true)
        if(data != undefined && data != null && data.length > 0){
            this.attributes = data[0]
            return true;
        }
        return false
    }
}

export class Show extends BaseEntity{
    //looks good
    constructor(attributes=null){
        super();
        this.attributes = attributes
        if(attributes === null){
            this.attributes = {
                ShowID:null,
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
        let {error} = await supabaseAdminClient.from('Shows').insert(this.attributes)
        console.log(error, "Class Show: Create() Tracer")
        if(error){console.log("Create():", false);return false}
        else{console.log("Create():", true);return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.from('Shows').delete().eq('ID', this.attributes.ID)
        console.log(response, "Class Show: Delete() tracer")
        if(response.error == null || response.error == undefined){console.log("Delete():", true);return true}
        console.log("Delete()", false)
        return false;
    }


    async Update(){
        let {error} = await supabaseAdminClient.from('Shows').update(this.attributes).eq('ID', this.attributes.ID)
        console.log("Class Show Update() tracer")
        if(error){console.log("Update():", false);return false}
        else{console.log("Update()", true); return true}
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Shows').select().eq('ID', this.attributes.ID)
        console.log("Class Show Exists() tracer")
        if(data != null && data != undefined && data.length > 0){console.log("Exists(): ", true); return true}
        else {console.log("Exists():", false); return false}
    } 

  
    async Ticket(attributes){
        //let val = await this.Exists()
        attributes.ID = this.attributes.ID
        attributes.BusinessOwnerID = this.attributes.ID
        attributes.CustomerID = null;
        attributes.Onsale = true;
        attributes.Refundable = false;
        attributes.ShowName = this.attributes.ShowName;
        attributes.Confirmed = false;
        var ticket = new Ticket(attributes)
        return ticket
    }

    async __synchronize_with_database_row(){
        let{data, error} = await supabaseAdminClient.from('Shows').select()
        .eq('ID', this.attributes.ID).eq('ShowID', this.attributes.ShowID)

        if(data != null && data != undefined && data.length > 0){
            this.attributes = data[0]
            return true;
        }
        return false;
    }

    async Synchronize(){
        let value = await this.__synchronize_with_database_row()
        return value
    }
}


export class EventGoBusiness extends BaseEntity{
    //Looks good
    constructor(attributes=null){
        super();
        this.attributes = attributes;
        if(attributes == null){
            this.attributes = {
                ID:null,
                Name:null,
                Address:null,
                NetProfit:null
            }
        }
    }

    async Create(){
        let{error} = await supabaseAdminClient.from('EventGoBusinesses').insert(this.attributes)
        console.log(error, "EventGoBusiness Create() tracer")
        if(error){console.log("Create():", false); return false}
        else {console.log("Create():", true); return true}
    }
    
    async Delete(){
        if(await this.Exists() == false){return false}
        let response = await supabaseAdminClient.from('EventGoBusinesses').delete().eq('ID', this.attributes.ID)
        console.log(response, "EventGoBusiness Delete() tracer")
        if(response.error == null || response.error == undefined){console.log("Delete():", true);return true}
        console.log("Update():", false);
        return false;
    }
    
    async Update(){
        if(await this.Exists() == false){return false}
        let{error} = await supabaseAdminClient.from('EventGoBusinesses').update(this.attributes).eq('ID', this.attributes.ID)
        console.log(error, "EventGoBusiness Update() tracer")
        if(error){console.log("Update():", false); return false;}
        else{console.log("Update():", true);  return true;}
    }

    async Exists(){
        const {data, error} = await supabaseAdminClient.from('EventGoBusinesses').select().eq('ID', this.attributes.ID)
        console.log(error, "EventGoBusiness Exists() tracer")
        if(data != null && data != undefined && data.length > 0){console.log("Existss():", true);return true}
        else if(error == null || error == undefined){console.log("Exists():", false); return false}
    }

    async Show(attributes){
        let value = await this.Exists()
        console.log(value, " Show() thing")
        if(value == false || value == null){return false}

        attributes.ID = this.attributes.ID
        var show = new Show(attributes)
        return show;
    }

    GetNetProfit(){return this.attributes.NetProfit}
    GetName(){return this.attributes.Name}
    GetAddress(){return this.attributes.Address}

    async __synchronize_with_database_row(){
        let{data, error} = await supabaseAdminClient.from('EventGoBusinesses').select().eq('ID', this.attributes.ID)

        if(data != null & data != undefined && data.length > 0){
            this.attributes = data[0]
            return true;
        }
        return false;
    }

    async Synchronize(){
        let success = await this.__synchronize_with_database_row()
        return success
    }
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
                console.log("supabase user: else")
                this.attributes={
                    email:null,
                    password:null,
                }
            }
        }
    
    async Create(){
        console.log(this.attributes, "Sign Up attributes")
        const{data, error} = await supabaseClient.auth.signUp(this.attributes)
        
        if(error != undefined && error != null){
            console.log("\x1b[31m"+error+"\x1b[0m", "Class SupabaseUser: Create() tracer"); 
            return false
        }
        else if(data !== undefined && data != null){
            console.log("User Created successfully")
            console.log("Created User", data)
            return data;
        }
    }

    async Delete(){
        let{data, error} = await supabaseAdminClient.auth.admin.deleteUser(this.attributes.ID)
        console.log(data, error, "Class SupabaseUser: Delete() tracer")
        if(data){return false}
        else if(error){return false}
    }

    async Update(){
        let{data, error} = await supabaseAdminClient.auth.updateUser(this.attributes)
        console.log(data, error, "Class SupabaseUser: Update() tracer")
        if(data)return true;
        else if(error)return false;
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.auth.admin.getUserById(this.attributes.ID)
        if(data)return true;
        else if(error)return false;
    }

}


export class EventGoUser{
//Tested
    constructor(attributes=null){

        this._supabase_user = null;
        this.list = ['UserID', 'Address', 'Email', 'Password']

        if(attributes !== null){
            this.attributes = attributes
        }
        else{
            this.attributes = {
                UserID:null,
                Address:null,
                Email:null,
                Password:null
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
        //if(this.__verify_attributes(this.attributes) == false){return EntityNotCreated}
        const{data, error} = await supabaseClient.from('EventGoUsers').insert(this.attributes)
        console.log(error, "EventGoUser Create()")
        if(error){console.log(false);return false;}
        console.log(true);
        return true;
    }

    async Delete(){
        const response = await supabaseClient.from('EventGoUsers').delete().eq('UserID', this.attributes.UserID)
        console.log(response, "EventGoUser Delete()")
        if(response.error == null || response.error == undefined) return true
        return false;
    }

    async Update(){
        let exists = await this.Exists()
        if(exists == false){console.log("EventGoUser Class Update(): User doesn't exist");return false;}

        let {data, error} = await supabaseAdminClient.from('EventGoUsers').update(this.attributes).eq('UserID', this.attributes.UserID)
        console.log(data, error, "EventGoUser Class Update() Tracer")
        if(error){console.log(false); return false;}
        else{console.log(true); return true;}
    }

    async Exists(){
        let {data, error} = await supabaseAdminClient.from('EventGoUsers').select().eq('UserID', this.attributes.UserID)
        if(data != null && data != undefined && data.length > 0){return true}
        else {return false}
    }

    async BuyTicket(ticket_details){
       
        let ticket = new Ticket(ticket_details)
        let value = await ticket.GetAvailableTicket()
        console.log(value, " BuyTicket() line 579")
        //Since there's no more ticket left we will return null;
        if(value == false){return null}

        ticket_details = ticket.Attributes()
        ticket_details.CustomerID = this.attributes.UserID
        ticket_details.Onsale = false;
        ticket_details.Confirmed = true;
        ticket.SetAttributes(ticket_details)
        var success = await ticket.Update()

        //Create transaction as well for the purchase
        let transaction = await ticket.Transaction()
        let val = await transaction.Create();
        if(val == true){
            console.log("transaction after purchase generated")
        }
        else{
            console.log("couldn't generate transaction after purchase")
        }
        return success
    }

    async __synchronize_with_database_row(){
        let{data, error} = await supabaseAdminClient.from('EventGoUsers').select()
        .eq('UserID', this.attributes.UserID)

        if(data != undefined && data != null && data.length > 0){
            this.attributes = data[0]
            return true;
        }
        return false;
    }

    async Synchronize(){
        let success = await this.__synchronize_with_database_row
        return success
    }

    async GetUserByEmailAndPass(){
        let {data, error}= await supabaseAdminClient.from('EventGoUsers').select()
        .eq('Email', this.attributes.Email).eq('Password', this.attributes.Password)

        if(data != null && data != undefined && data.length > 0){
            this.attributes = data[0]
            return true;
        }

        return false;
    }
}



export class CombinedUser extends BaseEntity{
    constructor(attributes=null){
        this.attributes = attributes
        this._supabase_user = new SupabaseUser(this.attributes)
        this._eventgo_user = new EventGoUser(this.attributes)
        this._ready = new Flag(true);

        if(attributes == null){this._ready.set_false();}
    }
   
    SupaUser(){return this._supabase_user}
    EventGoUser(){return this._eventgo_user}

    async Create(){
        let supa_user_resp = await this.SupaUser().Create()
        let eventgo_user_resp = await this.EventGoUser().Create()
    }

    async Delete(){
        let response1 = await this.SupaUser().Delete();
        let response2 = await this.EventGoUser().Create();
    }

    async Exists(){
        return await this.SupaUser().Exists() && await this.EventGoUser().Exists();
    }
}