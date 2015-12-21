
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  

var dbName = 'pets';
var collName = 'stores';

// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    collection.aggregate([{$group: {_id : "$cleanedAddress",meetingName: {$push: "$storeName"}, products: {$push: "products"}} }]).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log(docs);
        }
        db.close();
        
    });

}); //MongoClient.connect