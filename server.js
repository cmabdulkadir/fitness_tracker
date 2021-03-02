const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;


// mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
const db = require("./models");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));


app.get("/api/workouts", (req, res) => {
  db.Workout.find({}, null, { sort: {day: 1} })
    .populate("exercises")
    .then(queryResult => {
        queryResult.forEach(result => {
            var totalDuration = 0;

            result.exercises.forEach(exercise => {
                totalDuration += exercise.duration;
            })

            result.totalDuration = totalDuration;
        })

      console.log(queryResult)
      res.json(queryResult);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
    .populate("exercises")
    .then(queryResult => {
        queryResult.forEach(result => {
            var totalDuration = 0;

            result.exercises.forEach(exercise => {
                totalDuration += exercise.duration;
            })

            result.totalDuration = totalDuration;
        })
        console.log(queryResult)
      res.json(queryResult);
    })
    .catch(err => {
      res.json(err);
    });
})

// render exercise html
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"))
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"))
});


// adding new exercise
app.put("/api/workouts/:id", (req, res) => {

    db.Exercise.create(req.body)
    .then(({_id}) => {
        db.Workout.findByIdAndUpdate(
          req.params.id,
            // {_id: req.params.id},
            { $push: {exercises: _id}},
            { new: true }
            )
        .then(updateResult => {
            res.json(updateResult)
        })
    })

})

// adding new workouts
app.post("/api/workouts", (req, res) => {
    db.Workout.create({})
    .then(queryResult => {
      res.json(queryResult);
    })
    .catch(err => {
      res.json(err);
    });
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});