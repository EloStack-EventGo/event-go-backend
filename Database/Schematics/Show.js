import {BaseEntity} from "./BaseEntity.js";
import {Ticket} from "./Ticket.js";
import { supabaseAdminClient, supabaseClient } from "./Supabase.js";

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

    async Search(){
        let {data, error} = await supabaseAdminClient.from('Shows').select().match(this.attributes)
        console.log(data, error, " Show Search() tracer")
        if(error == null && (data != null && data != undefined)){
            console.log("Search():", true)
            return data;
        }
        console.log("Search():", false)
        return null;
    }
}
