module.exports = class Database {

    constructor(model) {
        this.Model = model;
    }

    aggregate(query) {
        return this.Model.aggregate(query);
    }

    get(query) {
        return this.Model.findOne(query);
    }

    getAll(query) {
        return this.Model.find(query);
    }

    update(data, query) {
        return this.Model.findByIdAndUpdate(data, query, { safe: true, upsert: true });
    }

    getProjectsByAddress(query) {
        return this.Model.find(query).select('projects -_id');
    }

    updatePull(query) {

        return this.Model.update({}, query, { "multi": true });
    }

}