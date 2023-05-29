const { connect } = require('./db/db.config');
const bcrypt = require('bcrypt');

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
    async findUser(email){
        const user = await this.db.users.findOne({ where: { email } });
        if(user)
            return true;
        else
            return false;
    }
    async findUser(mobile_number){
        const user = await this.db.users.findOne({ where: { mobile_number } });
        if(user)
            return true;
        else
            return false;
    }

    async getUser(mobile_number, password){
        try {
            const user = await this.db.users.findOne({ where: { mobile_number} });
            if (!user) {
                console.error('Invalid mobile number or password');
              return null;
            }
        
            const isPasswordValid = await bcrypt.compare(password, user.password);
        
            if (!isPasswordValid) {
                console.error('Invalid  mobile number or password');
              return null;
            }
        
            return user;
          } catch (error) {
            console.error(error);
           return null;
          }
    }

    async getUser(email, password){
        try {
            const user = await this.db.users.findOne({ where: { email } });
            console.log(user);
            if (!user) {
                console.error('Invalid email or password');
              return null;
            }
        
            const isPasswordValid = await bcrypt.compare(password, user.password);
        
            if (!isPasswordValid) {
                console.error('Invalid email or password');
              return null;
            }
        
            return user;
          } catch (error) {
            console.error(error);
           return null;
          }
    }

    async addUser(user) {
        let data = {};
        try {
            data = await this.db.users.create(user);
        } catch(err) {
            console.error('Error::' + err);
            return null;
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
            console.error('Error::' + err);
            throw new Error("can't update user");
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
            console.error('Error::' + err);
        }
        return data;
        return {status: `${data.deletedCount > 0 ? true : false}`};
    }

}

module.exports = new UsersController();