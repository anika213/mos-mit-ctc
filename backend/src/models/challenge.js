const mongoose = require ("mongoose");

const { Schema } = mongoose; 

// Probs need to change this depending on how we want to store passwords etc, just a placeholder for now

const schema = new Schema ({
    username: 
    {
        type: String, 
        required: false,
        unique: false
    }, 
    suggestedChallenge: 
    {
        type: String, 
        required: true
    }
    
})

module.exports = mongoose.model("challenge", schema); 