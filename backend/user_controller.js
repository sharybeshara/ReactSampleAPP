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
            const kids = await this.db.kids.findAll();
            console.log('kids:::', kids);
            return kids;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async addKid(kid) {
        let data = {};
        try {
            kid['userid'] = kid['first_name']+kid['last_name'] + this.makeid(4);
            data = await this.db.kids.create(kid);
        } catch (err) {
            console.error('Error::' + err);
            return null;
        }
        return data;
    }

    async getKidsPerParent(parent_id) {

        try {
            // const parent = await this.db.users.findOne({ where: { mobile_number } });
            const kids = await this.db.kids.findAll({
                where: {
                    parent_id: parent_id
                }
            });

            console.log('kids:::', kids);
            return kids;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    makeid(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    async findUser(mobile_number) {
        const user = await this.db.users.findOne({ where: { mobile_number } });
        if (user)
            return true;
        else
            return false;
    }

    async getUserById(id) {
        try {
            const user = await this.db.users.findOne({ where: { id } });
            if (!user) {

                return null;
            }
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async getUserByToken(token) {
        try {
            const user = await this.db.users.findOne({ where: { token } });
            if (!user) {

                return null;

            }
            return user;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getUser(mobile_number, password) {
        try {
            const user = await this.db.users.findOne({ where: { mobile_number } });
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

    async resetPassword(mobile_number, email, new_password) {
        try {
            let user = await this.db.users.findOne({ where: { mobile_number } });
            if (!user) {
                console.error('Invalid mobile number');
                return null;
            }
            if (user.email !== email) {
                console.error('Invalid email');
                return null;
            }
            user = await this.db.users.update({ password: new_password }, {
                where: {
                    mobile_number
                },
                returning: true,
            });
            return user[1][0];

        }
        catch (error) {
            console.error("Invalid mobile number or email");
            return null;
        }
    }

    async addUser(user) {
        let data = {};
        try {
            data = await this.db.users.create(user);
        } catch (err) {
            console.error('Error::' + err);
            return null;
        }
        return data;
    }

    async updateUser(user, id) {
        let data = {};
        try {

            data = await this.db.users.update({ ...user }, {
                where: {
                    id: id
                },
                returning: true,
            });
            // console.log(data[1][0]);
        } catch (err) {
            console.error('Error::' + err);
            throw new Error("can't update user");
        }
        return data[1][0];
    }

    async deleteUser(user_id) {
        let data = {};
        try {
            data = await this.db.users.destroy({
                where: {
                    id: user_id
                }
            });
        } catch (err) {
            console.error('Error::' + err);
        }
        return data;
        return { status: `${data.deletedCount > 0 ? true : false}` };
    }
    async updateKid(kid) {
        let data = {};
        try {

            data = await this.db.kids.update({ ...kid }, {
                where: {
                    id: kid.id
                }
            });
        } catch (err) {
            console.error('Error::' + err);
            throw new Error("can't update kid");
        }
        return data;
    }

    async deleteKid(kid_id) {
        let data = {};
        try {
            data = await this.db.kids.destroy({
                where: {
                    id: kid_id
                }
            });
        } catch (err) {
            console.error('Error::' + err);
        }
        return data;
        return { status: `${data.deletedCount > 0 ? true : false}` };
    }

}

module.exports = new UsersController();