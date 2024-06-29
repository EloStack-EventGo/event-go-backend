import { createClient } from '@supabase/supabase-js';
import {SUPA_URL, SUPA_ANON_KEY, SUPA_SERVICE_KEY} from './credentials.js';
import {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted} from './status_codes.js';
import { Flag } from './utilities.js';

const supabaseClient = createClient(SUPA_URL, SUPA_ANON_KEY)
const supabaseAdminClient = createClient(SUPA_URL, SUPA_SERVICE_KEY)

export class BaseEntity{
    constructor(){}
    SetAttributes(){}
    Exists(){}
    Update(){}
    Create(){}
    Delete(){}
    Search(){}
}

class Credential extends BaseEntity{}
class Ticket extends BaseEntity{}
class Show extends BaseEntity{}
class Transaction extends BaseEntity{}
export class EventGoBusiness extends BaseEntity{}


export class SupabaseUser extends BaseEntity{
        constructor(attributes=null){
            super();
            this.attributes = attributes
            if(this.attributes !== null){
                this.attributes={
                    email:attributes['email'],
                    password:attributes['password'],
                }
            }
            
            else{
                console.log("supabase useR: else")
                this.attributes={
                    email:null,
                    password:null,
                }
            }
        }
    
    //Create using Anon Key
    async Create(value){
        if(value == 'adminSDK'){}
        
        else if(value == 'clientSDK'){
            console.log(this.attributes, "Sign Up attributes")
            //REDIRECT URL FOR THE BACKEND SERVER
            //NOTE: Need to change things, because URL shouldn't be specified in here but in web_server.js
            const attributes = {
                ...this.attributes,
                options: {
                    emailRedirectTo: 'http://38.56.129.131:9999/-domain.com/confirmation' // Replace with your actual URL
                  }    
            }
            const{data, error} = await supabaseClient.auth.signUp(this.attributes)
            console.log(data, error, "Class SupabaseUser: Create()")
            if(data !== undefined){
                if((data['user'] == null)){console.log("no user created");return false;}
                else{ console.log("created user "); return data;}
            }
            else if(error !== undefined){console.log(error); return false}
        }
        console.log('select either adminSDK or clientSDK')
        return false;
    }
    //Delete using Anon key
    async Delete(){}
    async Login(){
        const {data, error} = await supabaseClient.auth.signInWithPassword(this.attributes)
    }
    async SignUp(){let response = await this.Create(); return response}
    async SignOut(){return 'SupabaseUser class error: empty signout'}
    async Update(){}
    async Exists(){}
}


export class EventGoUser{

    constructor(attributes=null){

        this._supabase_user = null;
        this.list = ['UserID', 'CreatedAt', 'Address', 'Email', 'DateJoined', 'Logged', 'CredentialID', 'Password']

        if(attributes !== null){
            this.attributes = attributes
        }
        else{
            this.attributes = {
                'UserID':null,
                'CreatedAt':null,
                'Address':null,
                'Email':null,
                'DateJoined':null,
                'Logged':null,
                'SupabaseUserID':null,
                'Password':null
            }
        }
    }

    SetAttributes(json_attr){
        this.attributes = json_attr;
    }

    __verify_attributes(list){
        for(let i = 0; i < list.length; i++){
            try{if(this.attributes[list[i]] == null){return false;}}
            catch(e){}
        }
        return true;
    }
    async Create(){

        //Ignore the UserID if it's not integer because you'd only have integer if someone explicitly wants to create userID
        if(typeof this.attributes.UserID != "number"){
            delete this.attributes.UserID;
            let list = this.list.slice(1, this.list.length)
            if(this.__verify_attributes(list) == false){return EntityNotCreated}
        }

        //Since someone wants to create user with specific user id we will run this
        if(this.__verify_attributes(this.attributes) == false){return EntityNotCreated}
        const{data, error} = await supabaseClient.from('EventGoUsers').insert(this.attributes)
        if(data){
            console.log("Yes", data)
            return EntityCreated
        }
        else if(error){
            console.log("No", error)
            return EntityNotCreated
        }
    }

    async Exists(){
        const response = await supabaseClient.from('Users').select()
    }
    async Search(){

    }
    async Update(){

    }
    async Delete(){
        //Delete the object in the database
        if(this.__verify_attributes(this.attributes) == false){return EntityNotDeleted}
        const {data, error} = await supabaseClient.from('Users').delete().eq('UserID', this.attributes['UserID'])
        if(data){
            console.log(data)
            return EntityDeleted}
        else if(error){
            console.log(error)
            return EntityNotDeleted}
    }

    async Login(){
        user_email = this.attributes.Email
        user_pass = this.attributes.Password
        if(user_email == "" && user_pass == ""){console.log("email and pass can't be empty")}
        let{data, error} = await supabaseClient.auth.signUp({
            email:user_email,
            password:user_pass
        })

        if(data){console.log(data, "success")}
        else{console.log(error, "error")}
    }

    SignOut(){}
    SignUp(){this.Create();}
    ChangeProfile(){}
    VerifyLogin(){}
    CancelTicket(){}
    BuyTicket(){}
    AccessCredentials(){}
}


export class CombinedUser{
    //NOTE: Maybe change name from combined to 'EventGo' since it is better
    constructor(attributes=null){
        this.attributes = attributes
        this._supabase_user = new SupabaseUser(this.attributes)
        this._eventgo_user = new EventGoUser(this.attributes)
        this._ready = new Flag(true);

        if(attributes == null){this._ready.set_false();}
    }
    __verify_attributes(){
        return this._ready.check();
    }
    
    SetAttributes(attributes){
        this.attributes = attributes
        if(this.attributes !== null){this._ready.set_true();}
        this._ready.set_false()
    }

    async SignOut(){
        if(this.__verify_attributes() == false){return false}
        try {
            // Revoking refresh token (optional)
            await supabaseAdminClient.auth.signOut({access_token: userId }); // Replace with actual token handling
            console.log('User with ID:', userId, 'signed out (refresh token revoked)');
        
            // OR
        
            // Custom session invalidation (alternative)
            // Implement logic to manipulate session data in Supabase using Admin SDK
          } catch (error) {
            console.error('Error signing out user:', error);
          }
    }

    async SignUp(){
        if(this.__verify_attributes() == false){return false}
        let response = await this._supabase_user.Create('clientSDK');
        console.log(response, "heree..")
        if(response !== false){
            //check if the user email is verified or not
            if(response['user']['user_metadata']['email_verified'] !== false){
                let attributes = {
                    'CreatedAt':response['user']['created_at'],
                    'Address':null,
                    'Email':response['user']['email'],
                    'Logged':null,
                    'SupabaseUserID':response['user']['id'],
                    'Password':response['user']['password']
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

}
export {EntityCreated, EntityNotCreated, EntityDeleted, EntityNotDeleted}