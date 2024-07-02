import { createClient } from "@supabase/supabase-js";
import { SUPA_ANON_KEY, SUPA_URL } from "./credentials.js";
import { SupabaseUser, EventGoUser, EventGoBusiness, CombinedUser, Transaction, Show, Ticket} from "./schema.js";
//import { SupabaseUser, EventGoUser, EventGoBusiness, CombinedUser, Transaction, Show, Ticket} from "./Schema/schema.js"

export class DatabaseSchema{
    constructor(){

    }
    SupaUser(attributes){return new SupabaseUser(attributes);}
    EventGoUser(attributes){return new EventGoUser(attributes);}
    User(attributes){return new CombinedUser(attributes);}
    Business(attributes){return new EventGoBusiness(attributes);}
    Transaction(attributes){return new Transaction(attributes)}
    Show(attributes){return new Show(attributes)}
    Ticket(attributes){return new Ticket(attributes)}
}


export class EventGoDatabase{

    constructor(){
        this.supa_database_client = createClient(SUPA_URL, SUPA_ANON_KEY)
        this.schema = new DatabaseSchema();
    }
    
    eventgo_schema(){
        return this.schema;
    }

    supabase_client(){
        return this.supa_database_client
    }
}