import {BaseEntity} from "./BaseEntity.js";
import {Show} from "./Show.js"


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