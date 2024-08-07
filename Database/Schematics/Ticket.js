import { BaseEntity } from "./BaseEntity.js";
import { Transaction } from "./Transaction.js";
import { supabaseAdminClient, supabaseClient } from "./Supabase.js";

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

    async Search(){
        let {data, error} = await supabaseAdminClient.from('Tickets').select().match(this.attributes)
        console.log(data, error, " Ticket Search() tracer")
        if(error == null && (data != null && data != undefined)){
            console.log("Search():", true)
            return data;
        }
        console.log("Search():", false)
        return null;
    }
}