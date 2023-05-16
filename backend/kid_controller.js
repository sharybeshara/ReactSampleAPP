const { connect } = require('./db/db.config');

class KidsController {

    db = {};

    constructor() {
        this.db = connect();
        
    }

    async getKids() {
        
        try {
            const kids = await this.db.kids.findAll();
            console.log('kids:::', kids);
            return kids;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async addKid(kid) {
        let data = {};
        try {
            data = await this.db.kids.create(kid);
        } catch(err) {
            logger.error('Error::' + err);
        }
        return data;
    }

    async updateKid(kid) {
        let data = {};
        try {

            data = await this.db.kids.update({...kid}, {
                where: {
                    id: kid.id
                }
            });
        } catch(err) {
            logger.error('Error::' + err);
        }
        return data;
    }

    async deletekid(kidId) {
        let data = {};
        try {
            data = await this.db.kids.destroy({
                where: {
                    id: kidId
                }
            });
        } catch(err) {
            logger.error('Error::' + err);
        }
        return data;
        return {status: `${data.deletedCount > 0 ? true : false}`};
    }

}

module.exports = new KidsController();