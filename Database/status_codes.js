export const EntityCreated = 'Entity created successfully'
export const EntityDeleted = 'Entity deleted successfully'
export const EntityNotDeleted = 'Entity not deleted successfully'
export const EntityNotCreated = 'Entity not created successfully'


//The list defines the status codes needed to indicate status of database operations
class GeneralStatusCodes{
    constructor(){
        this.EntityCreated = 'Entity created successfully'
        this.EntityDeleted = 'Entity deleted successfully'
    }
}

const GeneralStatus = new GeneralStatusCodes()
export default GeneralStatus;