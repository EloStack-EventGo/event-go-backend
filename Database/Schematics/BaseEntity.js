import { supabaseAdminClient, supabaseClient } from "./Supabase.js";

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