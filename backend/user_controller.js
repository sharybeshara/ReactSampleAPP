const { connect } = require('./db/db.config');

class UsersController {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async getUsers() {
        
        try {
            const users = await this.db.users.findAll();
            console.log('users:::', users);
            return users;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async getKids() {

        try {
            const users = await this.db.users.findAll({
              where: {
                user_role: "kid"
              }
            });
        
            console.log('kids:::', users);
            return users;
          } catch (error) {
            console.error(error);
            return [];
          }
    }

    async addUser(user) {
        let data = {};
        try {
            data = await this.db.users.create(user);
        } catch(err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async updateUser(user) {
        let data = {};
        try {

            data = await this.db.users.update({...user}, {
                where: {
                    id: user.id
                }
            });
        } catch(err) {
            logger.error('Error::' + err);
        }
        return data;
    }

    async deleteUser(userId) {
        let data = {};
        try {
            data = await this.db.users.destroy({
                where: {
                    id: userId
                }
            });
        } catch(err) {
            logger.error('Error::' + err);
        }
        return data;
        return {status: `${data.deletedCount > 0 ? true : false}`};
    }

}

module.exports = new UsersController();