import { createClient } from "@supabase/supabase-js";
import { SUPA_ANON_KEY, SUPA_URL } from "./credentials.js";
import { SupabaseUser, EventGoUser, EventGoBusiness, CombinedUser} from "./schema.js";


export class DatabaseSchema{

    constructor(){

    }
    User(attributes){return new CombinedUser(attributes);}
    Business(attributes){return new EventGoBusiness(attributes);}
    Transaction(attributes){}
    Show(attributes){}
    Ticket(attributes){}
}

export class EventGoDatabase{

    constructor(){
        this.database = createClient(SUPA_URL, SUPA_ANON_KEY)
        this.schema = new DatabaseSchema();
    }

    login(user_json_attr){
        this.schema.User(user_json_attr).Login();
    }
    signout(user_json_attr){
        this.schema.User(user_json_attr).SignOut();
    }
    signup(user_json_attr){
        this.schema.User(user_json_attr).SignUp();
    }
    eventgo_schema(){
        return this.schema;
    }
}