
// Register user
// Should probably run a schema validator before continuing the registration process
const Challenge = require('../models/challenge.js');
exports.addChallenge = async (req, res) => {
    const { body } = req
    // save the body of the request to the database mongoDB, the collection "suggestedChallenges" // TODO: double check this bit
    try {
        console.log(body);
        // const savedChallenge = await new Challenge(body).save();
        // res.status(201).json({ message: 'Challenge added successfully!' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error adding challenge' });
    }
    

};