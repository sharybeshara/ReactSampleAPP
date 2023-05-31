const { connect } = require('./db/db.config');
const UsersController = require('./user_controller');

class ActionsController {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async getActionsByKidId(kid_id) {
        try {
            const actions = await this.db.actions.findAll({
                where: {
                  kid_id: kid_id
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
           await this.db.kids.increment('total_points', { by: action.points, where: { id: action.kid_id }});
        } catch(err) {
            console.error('Error::' + err);
            return null;
        }
        return data;
    }
    async updateAction(action, id) {
        let data = {};
        console.log(action);

       

        try {
            const past_action = await this.db.actions.findOne({ where: { id} });
            console.log(past_action);
            const points_diff = parseInt(action.points) - parseInt(past_action.points)

            data = await this.db.actions.update({...action}, {
                where: {
                    id: id
                }
            });
            await this.db.kids.increment('total_points', { by: points_diff, where: { id: action.kid_id }});
        } catch(err) {
            console.error('Error::' + err);
            throw new Error("can't update action");
        }
        return data;
    }

    async deleteaction(action_id) {
        let data = {};
        try {
            data = await this.db.actions.destroy({
                where: {
                    id: action_id
                }
            });
        } catch(err) {
            console.error('Error::' + err);
        }
        return data;
        return {status: `${data.deletedCount > 0 ? true : false}`};
    }

   
}

module.exports = new ActionsController();