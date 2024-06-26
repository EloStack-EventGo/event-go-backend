
export class Flag{
    constructor(value=false){
        this.value = value
    }
    set_false(){this.value=false}
    set_true(){this.value=true}
    check(){return this.value}
}