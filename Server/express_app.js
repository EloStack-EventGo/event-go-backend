import express from 'express';
import cors  from 'cors';

export class ExpressServer{

    constructor(){
        //default port
        this._host_port = 8080
        this._app = express();
        this._cors = false;
        this._app.use(express.json())
    }

    app(){
        return this._app;
    }

    use_cors(value){
        //Enable the cors policy
        if(value){
            this._cors = true;
            return true;
        }

        //Disable the cors policy
        this._app.use(cors());
        return false;
    }

    set_port(port_num){
        //PUT a check for decimal incase
        this._host_port = port_num
    }

    start(){
        this._app.listen(this._host_port, ()=>{
            console.log(" Base Express Server: Running", " ON PORT:", this._host_port)
        })
    }

}
