/**
 * Yashar Zafari
 * 12/06/2023
 * 
 * Model file for picks collection in MongoDB
 */

'use strict';

// Mongoose connection to MongoDB
import mongoose from './db';

// Schema for each pick
const pickSchema = new mongoose.Schema({
    matchup_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Matchup'},
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    pick: { type: Boolean, required: true },
    correct: { type: Boolean, default: false }
});

// Compile model from Schema
const Pick = mongoose.model('Pick', pickSchema);

// Create Pick
const createPick = async (matchupID, userID, pick) => {
    const Pick = new Pick({
        matchup_id: matchupID,
        user_id: userID,
        pick: pick
    });
    return pick.save();
};

// Find pick
const findPicks = async (filter) => {
    const query = Pick.find(filter);
    return query.exec();
};

// Find pick by id
const findPickByID = async (_id) => {
    const query = Pick.findById(_id);
    return query.exec();
};

// Delete pick
const deletePickByID = async (_id) => {
    const res = await Pick.deleteOne({ _id: _id });
    return res.deletedCount;
};

// Edit pick
const editPick = async (_id, matchupID, userID, pick, correct) => {
    const res = await Pick.replaceOne({
        matchup_id: matchupID,
        user_id: userID,
        pick: pick,
        correct: correct
    });
    return res.modifiedCount;
};

// Export model functions for controller
export { createPick, findPicks, findPickByID, deletePickByID, editPick };