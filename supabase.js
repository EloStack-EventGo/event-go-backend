import express from 'express';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hhcrpjkcliunjhyvrjna.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3JwamtjbGl1bmpoeXZyam5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2OTAwMjUsImV4cCI6MjAzNDI2NjAyNX0.30kTdNs_u5CCETTXqjYI93y2wvQl7FDrHEoUCUALw7Q'
const supabase = createClient(supabaseUrl, supabaseKey)
const app = express();

class Test{

    Test(){
        this.details = {
            'value':"Some Value WOWWWW!"
        }
    }

    async Create(){
       const {data, error} = await supabase.from('Test').insert({
        'id':123234987,
        'created_at':'Some data that',
        'value':"Some Value WOWWWW!"
    })
       if(error){
            console.log("couldn't do it you idiot")
            console.log(error);
            return error
       }
       else {
            console.log("You did you idiot")
            console.log(data)
            return data
       }
    }
}

function CreateTableInDatabase(){};

app.get('/CreateTest', (req, res)=>{
    let test = new Test();
    let val = test.Create();
    let data = val['details'] + val['message']
    res.setHeader("Content-type", "tex/plain")
    res.send(data);
})

app.get('/Create', (req, res)=>{
    let val = {
        'response':'Created all the tables in database'
    }
    res.json(val);
    CreateTableInDatabase();

});

app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.send('This is the root url endpoinnt');
})

app.listen(8080, ()=>{
    console.log("Listening on port 8080....");
})
