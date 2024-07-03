import {
  EventGoUser,
  supabaseAdminClient,
  supabaseClient,
  Ticket,
} from "./schema.js";

//61321867-5baa-46af-83a5-a8757072b9c3
const details = {
  UserID: "f450ae12-6103-4d39-b960-130e3d2bb714",
  Email: "yashaswi2.kul@gmail.com",
  Password: "yash18hema06",
  Address: "750 3rd Ave 2771",
  SupabaseUserID: 9999,
};

async function createUser() {
  //Create Eventgo User
  let user = new EventGoUser(details);
  //user.SetAttributes(details);
  let response = await user.Create();
  console.log(response);
}

let ticket_details = {
  ID: null,
  CreatedAt: null,
  Price: null,
  BoughtBy: null,
  IssuedBy: null,
};

async function createUser2(id) {
  //Create Eventgo User
  details.UserID = id;
  let user = new EventGoUser(details);
  let response = await user.Create();
  console.log(response);

  //create ticket as well
  console.log(ticket_details, "before");
  ticket_details.ID = user.Attributes().UserID;
  ticket_details.CreatedAt = 87;
  ticket_details.Price = 250;
  ticket_details.BoughtBy = user.Attributes().UserID;
  ticket_details.IssuedBy = user.Attributes().UserID;
  let ticket = new Ticket(ticket_details);
  ticket.SetAttributes(ticket_details);
  console.log(ticket_details, " after");
  let resp2 = await ticket.Create();
  console.log(resp2, "ticket data");
}

async function get_session(user_email, pass) {
  let { data, error } = await supabaseAdminClient.auth.signInWithPassword({
    email: user_email,
    password: pass,
  });
  //console.log(data, error, " USER ACESS TOKEN")

  let user = await supabaseAdminClient.auth.getUser(data.session.access_token);
  console.log(user, "SESSION/USER TOKEN");
}

createUser();

//get_session("yashaswi.kul@gmail.com", "yash18hema06")
//createUser2(651233124);
//createUser2(13123124)
//createUser2(72324)
//createUser2(782468712)
