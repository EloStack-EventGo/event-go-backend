
import {EventGoUser, supabaseAdminClient, supabaseClient, Ticket} from "./schema.js";


//61321867-5baa-46af-83a5-a8757072b9c3
const details = {
    UserID:65123312,
    Email:"yashaswi.kul@gmail.com",
    Password:"yash18hema06",
    Address:"750 3rd Ave 2771",
    SupabaseUserID:625321123942
}

async function createUser(){
    //Get the supabase user
    const{data, error} = await supabaseAdminClient.schema('auth').from('users').select('id').eq('id', '61321867-5baa-46af-83a5-a8757072b9c3').single();
    console.log(data, error)

    //Create Eventgo User
    let user = new EventGoUser(details);
    let response = await user.Create();
    console.log(response);
}

let ticket_details = {
    ID:null,
    CreatedAt:null,
    Price:null,
    BoughtBy:null,
    IssuedBy:null
}

async function createUser2(id){
    //Create Eventgo User
    details.UserID = id
    let user = new EventGoUser(details);
    let response = await user.Create();
    console.log(response);

    //create ticket as well
    console.log(ticket_details, "before")
    ticket_details.ID = user.Attributes().UserID
    ticket_details.CreatedAt = 87
    ticket_details.Price = 250
    ticket_details.BoughtBy = user.Attributes().UserID
    ticket_details.IssuedBy = user.Attributes().UserID
    let ticket = new Ticket(ticket_details)
    ticket.SetAttributes(ticket_details)
    console.log(ticket_details, " after")
    let resp2 = await ticket.Create()
    console.log(resp2, "ticket data");
}

//createUser2(651233124);
//createUser2(13123124)
createUser2(72324)
//createUser2(782468712)