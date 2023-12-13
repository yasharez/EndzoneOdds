/**
 * Yashar Zafari
 * 12/06/2023
 * 
 * Model file for matchups collection in MongoDB
 */

'use strict';

// Mongoose connection to MongoDB
import mongoose from './db';

// Schema for each matchup
const matchupSchema = new mongoose.Schema({
    home_team: { type: String, required: true },
    away_team: { type: String, required: true },
    home_score: { type: Number, required: false },
    away_score: { type: Number, required: false },
    spread: { type: Number, required: true },
    season: { type: Number, required: true },
    week: { type: Number, required: true }
});

// Compile model from schema
const Matchup = mongoose.model("Matchup", matchupSchema);

// Create a matchup
const createMatchup = async (homeTeam, awayTeam, spread, season, week) => {
    const matchup = new Matchup({
        home_team: homeTeam,
        away_team: awayTeam,
        spread: spread,
        season: season,
        week: week
    });
    return matchup.save();
}

// Find a matchup
const findMatchups = async (filter) => {
    const query = Matchup.find(filter);
    return query.exec();
};

// Find a matchup by id
const findMatchupByID = async (_id) => {
    const query = Matchup.findById(_id);
    return query.exec();
};

// Delete matchup
const deleteMatchupByID = async (_id) => {
    const res = await Matchup.deleteOne({ _id: _id });
    return res.deletedCount;
};

// Edit matchup
const editMatchup = async (_id, homeTeam, awayTeam, homeScore, awayScore, spread, season, week) => {
    const res = await Matchup.replaceOne({ _id: _id }, {
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: homeScore,
        away_score: awayScore,
        spread: spread,
        season: season,
        week: week
    });
    return res.modifiedCount;
};

// Export model functions for controller
export { createMatchup, findMatchups, findMatchupByID, deleteMatchupByID, editMatchup };