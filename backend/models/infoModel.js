const { MongoDBCollectionNamespace } = require('mongodb');
const mongoose = require ('mongoose');

const Schema = mongoose.Schema

const infoSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    heartrate: {
        type: String,
        required: true
    },
    bloodpressure: {
        type: String,
        required: true
    },
    bloodsugar: {
        type: Number,
        required: true
    },
    user_id: {
      type: String,
      required: true  
    },
}, {timestamps: true} );

module.exports = mongoose.model('Info', infoSchema);

