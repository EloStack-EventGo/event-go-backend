import {BaseEntity} from "./BaseEntity.js";
import {Ticket} from "./Ticket.js";

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