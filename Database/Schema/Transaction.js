import { BaseEntity } from "./BaseEntity.js";


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