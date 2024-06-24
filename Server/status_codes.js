

//The list defines the status codes needed to indicate status of database operations
class GeneralStatusCodes{
    constructor(){
        this.EntityCreated = 'Entity created successfully'
        this.EntityDeleted = 'Entity deleted successfully'
    }
}

const GeneralStatus = new GeneralStatusCodes()
export default GeneralStatus;