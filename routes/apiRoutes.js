const db = require("../models");
const app = require("express").Router();

  app.get("/api/workouts", function(req, res) {
    // console.log("this is the result:", req.body);
    db.Workout.aggregate([
      {$addFields: {
        totalDuration: {$sum: "$exercises.duration"}
      }}
    ]).then(function(dbWorkouts) {
      res.json(dbWorkouts);
    }).catch(err => {
      res.json(err);
    }); 
  });

  app.post("/api/workouts", function({body},res) {
    console.log("this is the result", body);
      db.Workout.create(body)
      .then(dbWorkouts => {
        console.log(dbWorkouts);
        res.json(dbWorkouts);
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.get("/api/workouts/range", function(req,res) {
    db.Workout.aggregate(
      [
        {$addFields: {
          totalDuration: {$sum: "$exercises.duration"}
        }}
      ]).sort({
        _id:-1
      }).limit(7)
      .then(dbWorkouts => {
        res.json(dbWorkouts);
      }).catch(err => {
        res.json(err);
      }); 
  });

  app.put("/api/workouts/:id", function(req, res) {
    db.Workout.findByIdAndUpdate(
      req.params.id, {$push : { exercises: req.body}}, {new: true}
    ).then(dbWorkouts => {
      res.json(dbWorkouts);
    }).catch(err => {
      res.json(err);
    }); 
  });


 
module.exports = app
