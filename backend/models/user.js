const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

// Probs need to change this depending on how we want to store passwords etc, just a placeholder for now

const schema = new Schema ({
    username: 
    {
        type: String, 
        required: true
    }, 
    password: 
    {
        type: String, 
        required: true
    }
    
})

module.exports = model ("users", schema); 