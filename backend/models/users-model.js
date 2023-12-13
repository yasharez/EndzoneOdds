/**
 * Yashar Zafari
 * 12/12/2023
 * 
 * Model file for users collection in MongoDB
 */

'use strict';

// Mongoose connection to MongoDB
import mongoose from './db';

// Schema for each user
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    sub: { type: String, required: true },
    wins: { type: Number, default: 0 },
    ties_2nd: { type: Number, default: 0},
    ties_3rd: { type: Number, default: 0}
});

// Compile model from schema
const User = mongoose.model('User', userSchema);

// Create User
const createUser = async (firstName, lastName, sub) => {
    const user = new User({
        first_name: firstName,
        last_name: lastName,
        sub: sub
    });
    return user.save();
};

// Find user
const findUsers = async (filter) => {
    const query = User.find(filter);
    return query.exec();
};

// Find user by id
const findUserByID = async (_id) => {
    const query = User.findById(_id);
    return query.exec();
};

// Delete user
const deleteUserByID = async (_id) => {
    const res = await User.deleteOne({ _id: _id });
    return res.deletedCount;
};

// Edit user
const editUser = async (_id, firstName, lastName, sub, wins, ties2nd, ties3rd) => {
    const res = await User.replaceOne({
        first_name: firstName,
        last_name: lastName,
        sub: sub,
        wins: wins,
        ties_2nd: ties2nd,
        ties_3rd: ties3rd
    });
    return res.modifiedCount;
};

// Export model functions for controller
export { createUser, findUsers, findUserByID, deleteUserByID, editUser };