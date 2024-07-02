import {BaseEntity} from "./BaseEntity.js";
import {Ticket} from "./Ticket.js";


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