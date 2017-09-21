const Schema = require('mongoose').Schema;

const modelSchema = new Schema({
    _id: {
        type: String
    },
    projects: {
        type: Array
    }
});

// global db
module.exports = db.model('Creator', modelSchema);