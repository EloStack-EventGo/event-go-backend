import { BaseEntity } from "./BaseEntity.js";
import { supabaseAdminClient, supabaseClient } from "./Supabase.js";

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