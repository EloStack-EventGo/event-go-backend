import {createClient} from '@supabase/supabase-js';
//import {SUPA_URL, SUPA_ANON_KEY} from './Backend/Server/credentials.js';
const SUPA_URL = 'https://hhcrpjkcliunjhyvrjna.supabase.co'
const SUPA_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3JwamtjbGl1bmpoeXZyam5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2OTAwMjUsImV4cCI6MjAzNDI2NjAyNX0.30kTdNs_u5CCETTXqjYI93y2wvQl7FDrHEoUCUALw7Q'
const SUPA_SERVICE_KEY = ''


let supabase = createClient(SUPA_URL, SUPA_SERVICE_KEY);

async function create_user_in_table(){
    const{data, error} = await supabase.from('users').insert()
}

async function signup_user(user_email, user_pass){
    if(user_email == "" && user_pass == ""){console.log("email and pass can't be empty")}
    let{data, error} = await supabase.auth.signUp({
        email:user_email,
        password:user_pass
    })

    if(data){console.log(data, "success")}
    else{console.log(error, "error")}
}



class SupabaseUser{

    constructor(attributes=null){
        if(attributes !== null){
            this.attributes = attributes
        }

        this.attributes = {
            'email':null,
            'password':null
        }
    }

    SetAttributes(){

    }

    async Create(){
        const {data, error} = supabase.from('auth.users').insert(this.attributes)
        console.log(data)
        console.log(error)
    }
}

let user = new SupabaseUser({
    email:'pojoril283@joeroc.com',
    password:'randompass1234'
})

user.Create();

//signup_user("yashaswi.kul@gmail.com", "yash18hema06");