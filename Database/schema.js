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
        if(error){return false}
        else{return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.from('Transactions').delete().eq('ID', this.attributes.ID)
        console.log(response, "Class Transaction: Delete() tracer")
        if(response){return false}
        else{return true}
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('Transactions').update(this.attributes).eq('ID', this.attributes.ID)
        if(error)return false;
        else return true;
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Transactions').select().eq('ID', this.attributes.ID)
        if(data)return true;
        else if(error)return false;
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

    async GenerateTransaction(attributes){
        attributes.ID = this.attributes.ID
        attributes.PaymentBy = this.attributes.CustomerID
        attributes.PaymentTo = this.attributes.BusinessOwnerID
        this.Amount = this.Price
        let transaction = new Transaction(attributes)
        var success = await transaction.Create();
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
        console.log(error)
        if(error){return false}
        else{return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.fron('Tickets').delete().eq('ID', this.attributes.ID)
        console.log(response)
        if(response){return true}
        else{return false}
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('Tickets').update(this.attributes).eq('ID', this.attributes.ID)
        console.log(error, " Class Ticket: Updated()")
        if(error){return false}
        else{return true;}
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Tickets').select().eq('ID', this.attributes.ID)
        if(data)return true;
        else if(error) return false;
    }

    async __synchronize_with_database_entry(){
        //Synchronizes the attribute in the database within the object. Then same attributes can be accessed
        let{data, error} = await supabaseAdminClient.from('Tickets').select().eq('ID', this.attributes.ID)
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
        let success = await this.__synchronize_with_database_entry()
        return success;
    }

    async GetAvailableTicket(){
        let{data, error} = await supabaseAdminClient.from('Tickets').select()
        .eq('ID', this.attributes.ID)
        .eq('Onsale', true)
        if(data != undefined && data != null){
            this.attributes = data[0]
            return true;
        }
        return false
    }
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
        let {error} = await supabaseAdminClient.from('Shows').insert(this.attributes)
        console.log(error, "Class Show: Create() Tracer")
        if(error){return false}
        else{return true}
    }

    async Delete(){
        let response = await supabaseAdminClient.from('Shows').delete().eq('ID', this.attributes.ID)
        console.log(response, "Class Show: Delete() tracer")
        if(response){return true}
        else return false;
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('Shows').update(this.attributes).eq('ID', this.attributes.ID)
        if(error){return false}
        else{return true}
    }

    async Exists(){
        let{data, error} = await supabaseAdminClient.from('Shows').select().eq('ID', this.attributes.ID)
        if(data != null && data != undefined && data.length > 0){return true}
        else {return false}
    }

    async CreateTicket(attributes){
        if(await this.Exists() == false){console.log("CreateTicket()!!");return false}

        attributes.ID = this.attributes.ID
        attributes.BusinessOwnerID = this.attributes.ID
        attributes.CustomerID = null;
        attributes.Onsale = true;
        attributes.Refundable = false;
        attributes.ShowName = this.attributes.ShowName;
        attributes.Confirmed = false;

        var ticket = new Ticket(attributes)
        let success = await ticket.Create();
        return success
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
                NetProfit:null
            }
        }
    }

    async Create(){
        let{error} = await supabaseAdminClient.from('EventGoBusinesses').insert(this.attributes)
        console.log(error)
        if(error){return false}
        else {return true}
    }
    
    async Delete(){
        if(await this.Exists() == false){return false}
        let response = await supabaseAdminClient.from('EventGoBusinesses').delete().eq('ID', this.attributes.ID)
        console.log(response)
        if(response){return false}
        else{return true}
    }
    
    async Update(){
        if(await this.Exists() == false){return false}
        let{error} = await supabaseAdminClient.from('EventGoBusinesses').update(this.attributes).eq('ID', this.attributes.ID)
        console.log(error)
        if(error){return true}
        else if(error){return false}
    }

    async Exists(){
        const {data, error} = await supabaseAdminClient.from('EventGoBusinesses').select().eq('ID', this.attributes.ID)
        //console.log(data, error)
        if(data != null && data != undefined && data.length > 0){return true}
        else if(error == null || error == undefined){return false}
    }

    async CreateShow(attributes){
        if(await this.Exists() == false){return false}
        attributes.ID = this.attributes.ID
        let show = new Show(attributes)
        let response = await show.Create()
        console.log(response)
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
}


async function test3(){
    let details = {
                ID:'636da2d2-4167-4109-badc-664536a23799',
                Name:'GTA Productions',
                Address:'555 Claire Ave, Vista, CA 91912',
                NetProfit:9000
    }

    let business = new EventGoBusiness(details)
    //return false
    
    if(await business.Exists() == false){
        console.log (await business.Create(), " BUSINESSS");
    }
 
    let show_details = {
        ID:null,
        CreatedAt:null,
        ShowName:'La Holla Chills',
        HostDate:null,
        EndDate:null,
        StartTime:null,
        EndTime:null,
        Venue:'Universe, Multimilk, IDK',
        BusinessOwner:12941249124,
        SeatsArranged:5,
        Category:'Horror',
        ShowType:'Useless',
        HostedBy:'Amazon'
    }
    
    var bs_show = await business.Show(show_details)
    console.log(bs_show, " show status")
    let val = await bs_show.Create()
    console.log(val, " value")
    
    let ticket_details = {
        ID:null,
        CreatedAt:6,
        Price:4444,
        Onsale:null,
        Refundable:null,
        Confirmed:null,
        BusinessOwnerID:null,
        CustomerID:null,
        ShowName:null
}

    let ticket = await bs_show.Ticket(ticket_details)
    let val2 = await ticket.Create();
    console.log(val2, " ticket status")
}


async function BuyTicketFor(user_email, pass){
    let data = await supabaseAdminClient.auth.signInWithPassword({email:user_email, password:pass})
    data = data.data
    let uuid = data.user.id
    let access_token = data.session.access_token
    console.log(data.user)
    let user = new EventGoUser({
        UserID:uuid,
        Email:data.user.email,
        Password:null,
        Address:null
    })

    let response = await user.BuyTicket({
        ID:'636da2d2-4167-4109-badc-664536a23799',
        CreatedAt:6543,
        Price:1000,
        Onsale:null,
        Refundable:null,
        Confirmed:null,
        BusinessOwnerID:192385123,
        CustomerID:12495824123,
        ShowName:null});
}
//test3()
BuyTicketFor("Random@gmail.com", "random")


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


async function test(){
    let t = new Show({
        ID:1,
        CreatedAt:null,
        ShowName:'GTA5 7612 Vice City',
        HostDate:null,
        EndDate:null,
        StartTime:null,
        EndTime:null,
        Venue:'Los Angeles, CA',
        BusinessOwner:12941249124,
        SeatsArranged:5,
        Category:'Gaming',
        ShowType:'Useless',
        HostedBy:'Netflix'
    })
    
    //let resp = await t.Create()
    let resp = await t.CreateTicket({
                ID:null,
                CreatedAt:6543,
                Price:1000,
                Onsale:null,
                Refundable:null,
                Confirmed:null,
                BusinessOwnerID:192385123,
                CustomerID:12495824123,
                ShowName:null
    })
    console.log(resp)
}

export class EventGoUser{

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
        //Since someone wants to create user with specific user id we will run this
        //if(this.__verify_attributes(this.attributes) == false){return EntityNotCreated}
        const{error} = await supabaseClient.from('EventGoUsers').insert(this.attributes)
        if(error)return false;
        return true;
    }

    async Delete(){
        if(this.__verify_attributes(this.attributes) == false){return EntityNotDeleted}
        const response = await supabaseClient.from('EventGoUsers').delete().eq('UserID', this.attributes['UserID'])
        if(response) return false
        return true;
    }

    async Update(){
        let {error} = await supabaseAdminClient.from('EventGoUsers').update(this.attributes).eq('UserID', this.attributes.UserID)
        if(error)return false;
        else return true;
    }

    async Exists(){
        let {data, error} = await supabaseAdminClient.from('EventGoUsers').select().eq('UserID', this.attributes.UserID)
        if(data)return true;
        else if(error)return false;
    }

    async BuyTicket(ticket_details){
        /**
         * {
        ID:'636da2d2-4167-4109-badc-664536a23799',
        CreatedAt:6543,
        Price:1000,
        Onsale:null,
        Refundable:null,
        Confirmed:null,
        BusinessOwnerID:192385123,
        CustomerID:12495824123,
        ShowName:null}
         */
        let ticket = new Ticket(ticket_details)
        //let synchronized = await ticket.Synchronize()
        let value = await ticket.GetAvailableTicket()
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
}


async function test2(){
    let details = {
        UserID:'636da2d2-4167-4109-badc-664536a23799',
        Address:"750 3rd Ave, Chula Vista, CA 0000",
        Email:"yashaswi.kul@gmail.com",
        SupabaseUserID:"random_id",
        Password:"yash18hema06"
    }
    let evuser = new EventGoUser(details)
    let val = await evuser.Update();
    console.log(val)
    //evuser.SetAttributes(details)
    let resp = await evuser.BuyTicket({
                ID:1,
                CreatedAt:6543,
                Price:67,
                Onsale:true,
                Refundable:false,
                Confirmed:false,
                BusinessOwnerID:192385123,
                CustomerID:12495824123,
                ShowName:"GTA5 7612 Vice City"  
    })

    console.log(resp)
}


export class CombinedUser extends BaseEntity{
    /*This class is meant to represent the entire USER combining two tables. It doesn't work just yet but it will in future*/
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
        return this.SupaUser().Exists() && this.EventGoUser().Exists();
    }
}