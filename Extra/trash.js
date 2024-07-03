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

/*

        //Ignore the UserID if it's not integer because you'd only have integer if someone explicitly wants to create userID
        /*if(typeof this.attributes.UserID != "number"){
            delete this.attributes.UserID;
            let list = this.list.slice(1, this.list.length)
            if(this.__verify_attributes(list) == false){return EntityNotCreated}
        }
*/

/*
class EventGoServer{

    constructor(){
        //NOTE: If you remove a function then make sure to remove route as well
        expressServer.app().get('/', this.root)
        expressServer.app().get('/login', this.user_login)
        expressServer.app().get('/signup', this.user_signup)
        expressServer.app().get('/hostshow', this.create_show)
        expressServer.app().get('/confirmation', this.confirmation)
    }

    root(req, res){
        res.send("root is working...")
    }

    start(){
        console.log("EventGoServer has started...")
        expressServer.start()
    }

    //URL route for login
    async user_login(req, res){
        let response = await database.login(req.query)
        console.log(response)
        if(response == false){
            let server_resp = new ServerResponse(null)
            server_resp.set_not_sucess('Login Unsuccessful')
            res.json(server_resp.get())
            return false;
        }

        //If login is successful
        let server_resp = new ServerResponse(response)
        server_resp.set_success('Login Successful')
        res.json(server_resp.get());
    }


    //Route for sign up
    async user_signup(req, res){
        let response = await database.signup(req.query)
        console.log(response, "server route signup")
        if(response == false){
            let server_resp = new ServerResponse(null)
            server_resp.set_not_sucess('SignUp unsuccessful')
            res.json(server_resp.get())
            return false;
        }

        let server_resp = new ServerResponse(response['user'])
        server_resp.set_response(response['user'])
        server_resp.set_success('SignUp Successfull')
        res.json(server_resp)
    }

    //Route for sign ou
    user_signout(req, res){
        let response = database.signout(req.query)
    }

    //Route for creatin show
    create_show(req, res){
        res.send("Endpoint works but no functionality yet")
    }

    //Confirmation
    confirmation(req, res){
        console.log(req, "Class EventGoServer:  Confirmation recieved")
        console.log(req.query, req.body)
        //database.complete_sign_up()
        res.send("Confirmation endpoint reached")
        /*
        //Verify the data before creating EventGoUser object in the table
        let respponse = database.eventgo_schema().EventGoUser(data).Create();

        if(respone == EntityCreated){
            const resp = ServerResponse(response)
            resp.set_success('Successfully confirmed user and created user schema')
            return res.send(resp.get())
        }
            
    }
}

const EVG = new EventGoServer();
EVG.start();
*/

/*
//REDIRECT URL FOR THE BACKEND SERVER
        //NOTE: Need to change things, because URL shouldn't be specified in here but in web_server.js
        const attributes = {
            ...this.attributes,
            options: {
                //emailRedirectTo: 'http://38.56.129.131:9999/-domain.com/confirmation' // Replace with your actual URL
            }    
        }
*/

/*
async login(user_json_attr){
        let resp = this.schema.User(user_json_attr).Login();
        return resp;
    }

    async signout(user_json_attr){
        return this.schema.User(user_json_attr).SignOut();
    }

    async signup(user_json_attr){
        let resp = await this.schema.SupaUser(user_json_attr).Create();
        return resp;
    }

    async complete_sign_up(user_json_attr){
        let resp = await this.schema.EventGoUser(user_json_attr).Create();
        return resp;
    }

//let response = await database.login(req.query)
let response = await database.signup(req.query)
*/

/**
 * 
 * if((data['user'] == null)){console.log("no user created");return false;}
            else{ console.log("created user "); 
                this.user_session = data
                return data;}
 */

/**
                 * 
                 * # BASIC AUTH REQUEST FLOW

636da2d2-4167-4109-badc-664536a2379
                 */

/**
 * 
 *  async SignUp(){
        if(this.__verify_attributes() == false){return false}
        let response = await this._supabase_user.Create();
        console.log(response, "Class CombinedUser: Trace response")
        if(response !== false){
            //check if the user email is verified or not
            if(this._supabase_user.Authenticated() === false){
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

    async Login(){
        let{data, error} = await supabaseClient.auth.signInWithPassword({
            email:this.attributes['email'],
            password:this.attributes['password']
        })

        console.log(data, error)
        if(data !== undefined){
            if(data['user'] == null) return false;
            //If session is valid
            if(data['session'] == null){
                return data;
            }
            //If session is invalid but account is authenticated
            else if(data['session'] !== null){
                return data
            }
            //Add some code to handle in case accoutn doesn't exist
        }
        else if(error !== undefined){
            return false;
        }
    }

    
    async SignOut(){
        if(this.__verify_attributes() == false){return false}
        this.SupaUser().SignOut();
    }

     __verify_attributes(){
        return this._ready.check();
    }
    
    SetAttributes(attributes){
        this.attributes = attributes
        if(this.attributes !== null){this._ready.set_true();}
        this._ready.set_false()
    }
 */
