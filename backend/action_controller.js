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
    async addActions(actions, ids) {
        let data = {};
        try {
            data = await this.db.actions.bulkCreate(actions);
           await this.db.kids.increment('total_points', { by: actions[0].points, where: { id: ids}});
        } catch(err) {
            console.error('Error::' + err);
            return null;
        }
        return data;
    }
    async updateAction(action, id) {
        let data = {};
        try {
            const past_action = await this.db.actions.findOne({ where: { id} });
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

    async deleteaction(action_id, points, kid_id) {
        let data = {};
        try {
            data = await this.db.actions.destroy({
                where: {
                    id: action_id
                }
            });
            await this.db.kids.decrement('total_points', { by: points, where: { id: kid_id }});
        } catch(err) {
            console.error('Error::' + err);
        }
        return data;
    }

   
}

module.exports = new ActionsController();