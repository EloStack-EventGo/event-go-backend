import express from 'express';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hhcrpjkcliunjhyvrjna.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3JwamtjbGl1bmpoeXZyam5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2OTAwMjUsImV4cCI6MjAzNDI2NjAyNX0.30kTdNs_u5CCETTXqjYI93y2wvQl7FDrHEoUCUALw7Q'
const supabase = createClient(supabaseUrl, supabaseKey)
const app = express();


class Test{

    Test(){
        this.details = {
            'id':'',
            'created_at':'',
            'value':"Some Value WOWWWW!"
        }
    }

    async Create(){
       const {error} = await supabase.from('Test').insert(this.details)
       console.log(error);
       return error;
    }
}

function CreateUsers(){

}

function CreateBusinesses(){

}

function CreateShows(){

}

function CreateTableInDatabase(){
};




app.get('/Create', (req, res)=>{
    let val = {
        'response':'Created all the tables in database'
    }
    res.json(val);
    CreateTableInDatabase();

});

app.get('/CreateTest', (req, res)=>{
    let test = new Test();
    console.log(test.Create());
})

app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.send('This is the root url endpoinnt');
})

app.listen(8080, ()=>{
    console.log("Listening on port 8080....");
})
