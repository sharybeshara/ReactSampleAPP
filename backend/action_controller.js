const { connect } = require('./db/db.config');
const UsersController = require('./user_controller');

class ActionsController {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async getActionsByUserId(user_id) {
        try {
            const actions = await this.db.actions.findAll({
                where: {
                  user_id: user_id
                }
              });
            console.log('actions:::', actions);
            return actions;
        } catch (err) {
            console.log(err);
            return [];
        }
    }
    async addAction(action) {
        console.log("controller", action);
        let data = {};
        try {
            data = await this.db.actions.create(action);
           await this.db.users.increment('total_points', { by: action.points, where: { id: action.user_id }});
        } catch(err) {
            console.error('Error::' + err);
            return null;
        }
        return data;
    }

   
}

module.exports = new ActionsController();