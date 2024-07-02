import {EventGoUser, supabaseAdminClient, supabaseClient, Ticket} from "./schema.js";


async function test2(){
    let details = {
        UserID:'636da2d2-4167-4109-badc-664536a23799',
        Address:"750 3rd Ave, Chula Vista, CA 0000",
        Email:"yashaswi.kul@gmail.com",
        SupabaseUserID:"random_id",
        Password:"yash18hema06"
    }
    let evuser = new EventGoUser(details)
    let val = await evuser.Update();
    console.log(val)
    //evuser.SetAttributes(details)
    let resp = await evuser.BuyTicket({
                ID:1,
                CreatedAt:6543,
                Price:67,
                Onsale:true,
                Refundable:false,
                Confirmed:false,
                BusinessOwnerID:192385123,
                CustomerID:12495824123,
                ShowName:"GTA5 7612 Vice City"  
    })

    console.log(resp)
}


async function test(){
    let t = new Show({
        ID:1,
        CreatedAt:null,
        ShowName:'GTA5 7612 Vice City',
        HostDate:null,
        EndDate:null,
        StartTime:null,
        EndTime:null,
        Venue:'Los Angeles, CA',
        BusinessOwner:12941249124,
        SeatsArranged:5,
        Category:'Gaming',
        ShowType:'Useless',
        HostedBy:'Netflix'
    })
    
    //let resp = await t.Create()
    let resp = await t.CreateTicket({
                ID:null,
                CreatedAt:6543,
                Price:1000,
                Onsale:null,
                Refundable:null,
                Confirmed:null,
                BusinessOwnerID:192385123,
                CustomerID:12495824123,
                ShowName:null
    })
    console.log(resp)
}


async function test3(){
    let details = {
                ID:'636da2d2-4167-4109-badc-664536a23799',
                Name:'GTA Productions',
                Address:'555 Claire Ave, Vista, CA 91912',
                NetProfit:9000
    }

    let business = new EventGoBusiness(details)
    //return false
    
    if(await business.Exists() == false){
        console.log (await business.Create(), " BUSINESSS");
    }
 
    let show_details = {
        ID:null,
        CreatedAt:null,
        ShowName:'La Holla Chills',
        HostDate:null,
        EndDate:null,
        StartTime:null,
        EndTime:null,
        Venue:'Universe, Multimilk, IDK',
        BusinessOwner:12941249124,
        SeatsArranged:5,
        Category:'Horror',
        ShowType:'Useless',
        HostedBy:'Amazon'
    }
    
    var bs_show = await business.Show(show_details)
    console.log(bs_show, " show status")
    let val = await bs_show.Create()
    console.log(val, " value")
    
    let ticket_details = {
        ID:null,
        CreatedAt:6,
        Price:4444,
        Onsale:null,
        Refundable:null,
        Confirmed:null,
        BusinessOwnerID:null,
        CustomerID:null,
        ShowName:null
}

    let ticket = await bs_show.Ticket(ticket_details)
    let val2 = await ticket.Create();
    console.log(val2, " ticket status")
}


async function BuyTicketFor(user_email, pass){
    let data = await supabaseAdminClient.auth.signInWithPassword({email:user_email, password:pass})
    data = data.data
    let uuid = data.user.id
    let access_token = data.session.access_token
    console.log(data.user)
    let user = new EventGoUser({
        UserID:uuid,
        Email:data.user.email,
        Password:null,
        Address:null
    })

    let response = await user.BuyTicket({
        TicketID:5,
        ID:'636da2d2-4167-4109-badc-664536a23799',
        CreatedAt:6543,
        Price:1000,
        Onsale:null,
        Refundable:null,
        Confirmed:null,
        BusinessOwnerID:192385123,
        CustomerID:12495824123,
        ShowName:null});

        if(response == true){
            console.log("SUCCESSFULLY purhcased ticket")
            return true;
        }

        console.log("Tickets aren't available to purchase")
        return response

    }


async function createtickets(val ){
    for(let i = 0; i < val; i++){
        await test3()
    }
}

//createtickets(4)
BuyTicketFor("Random@gmail.com", "random")

