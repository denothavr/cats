var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas

var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var Cat = new Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true } ,
    color: { type: String, required: true },
    images: { type: String, required: false },
    modified: { type: Date, default: Date.now }
});

var CatModel = mongoose.model('Cat', Cat);

module.exports.CatModel = CatModel;