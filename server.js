var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var GOALS_COLLECTION = "goals";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server. 
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/goals", function(req, res) {
  db.collection(GOALS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get goals.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

app.post("/goals", function(req, res) {
  var newGoal = req.body;
  newGoal.createDate = new Date();

  if (!(req.body.goalName)) {
    handleError(res, "Invalid user input", "Must provide a goal name.", 400);
  }

  db.collection(GOALS_COLLECTION).insertOne(newGoal, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new goal.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/goals/:id", function(req, res) {
  db.collection(GOALS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get goal");
    } else {
      res.status(200).json(doc);  
    }
  });
});

app.put("/goals/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(GOALS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update goal");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/goals/:id", function(req, res) {
  db.collection(GOALS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete goal");
    } else {
      res.status(204).end();
    }
  });
});