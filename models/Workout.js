var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var workoutSchema = new Schema({
    day: { type: Date, required: true, default: new Date(new Date().setDate(new Date().getDate())) },

    exercises: [{
        type: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
        },
        reps: {
            type: Number,
        },
        sets: {
            type: Number,
        },
        distance : {
            type: Number,
        }

    }]
});

var Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
