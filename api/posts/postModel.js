const mongoose = require('mongoose'); 

const postSchema = new mongoose.Schema({
    fileName: {type: String},
    ipfsHash: {type: String},
    transactionHash: {type: String},
    }, {
        timestamps: true,
    });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;