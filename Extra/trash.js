/*

const app = express();

function CreateUser(params){
    let user = new User();
    user.SetAttributes(params)
    let response = user.Create();
    if(response == EntityCreated){
        return true;
    }
    return false;
}

function DeleteUser(params){
    let user = new User();
    user.SetAttributes(params)
    let response = user.Delete()
    if(response == EntityDeleted){return true;}
    return false;
}

app.get('/CreateUser', (req, res)=>{
    let value = CreateUser(req.query);
    if(value){res.send("User created successfully")}
    else{
        res.send(value)
    }
})  

app.get('/DeleteUser', (req, res)=>{
    let value = DeleteUser(req.query);
    if(value){res.send("Deleted user successfully")}
    else{
        res.send(value)
    }
})

app.get('/', (req, res)=>{
    res.send("Root URL is working...")
})

app.get('/TestUserData', (req, res)=>{
    let resp = {
        'UserID': 12387123124,
        'CreatedAt':"12/12/2024 09:34:23 PM",
        'Address':"456 theodore street, San Marcos, CA 91919",
        'Email':"fake@mail.com",
        'DateJoined':'12/12/2024',
        'Logged':false,
        'CredentialID':12931233
    }
    res.json(resp);
})

app.listen(8888, ()=>{console.log("server is running.....")})






*/


/*
async SignUp(){
        if(this.__verify_attributes() == false){return false}
        let response = await this._supabase_user.Create();
        console.log(response, "Class CombinedUser: Trace response")
        if(response !== false){
            //check if the user email is verified or not
            if(response['user']['user_metadata']['email_verified'] === false){
                let attributes = {
                    Address:null,
                    Email:response['user']['email'],
                    SupabaseUserID:response['user']['id'],
                    Password:response['user']['password']
                }
                this._eventgo_user.SetAttributes(attributes)
                let response = await this._eventgo_user.Create();
                if(response == EntityCreated){return EntityCreated}
                else{console.log(EntityNotCreated);return false}
            }

            else{
                console.log(response)
                return false
            }
        }
        console.log('Supabase user couldnt be created')
        return false
    }
*/