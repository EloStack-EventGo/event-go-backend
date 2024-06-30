import { createClient } from "@supabase/supabase-js";
import { SUPA_ANON_KEY, SUPA_URL } from "./credentials.js";
import { SupabaseUser, EventGoUser, EventGoBusiness, CombinedUser} from "./schema.js";


export class DatabaseSchema{
    constructor(){

    }
    SupaUser(attributes){return new SupabaseUser(attributes);}
    EventGoUser(attributes){return new EventGoUser(attributes);}
    User(attributes){return new CombinedUser(attributes);}
    Business(attributes){return new EventGoBusiness(attributes);}
    Transaction(attributes){}
    Show(attributes){}
    Ticket(attributes){}
}

export class EventGoDatabase{

    constructor(){
        this.supa_database_client = createClient(SUPA_URL, SUPA_ANON_KEY)
        this.schema = new DatabaseSchema();
    }

    async login(user_json_attr){
        let resp = this.schema.User(user_json_attr).Login();
        return resp;
    }

    async signout(user_json_attr){
        return this.schema.User(user_json_attr).SignOut();
    }

    async signup(user_json_attr){
        //let resp = await this.schema.User(user_json_attr).SignUp();
        let resp = await this.schema.SupaUser(user_json_attr).Create();
        return resp;
    }

    async complete_sign_up(user_json_attr){
        let resp = await this.schema.EventGoUser(user_json_attr).Create();
        return resp;
    }
    
    eventgo_schema(){
        return this.schema;
    }

    supabase_client(){
        return this.supa_database_client
    }
}