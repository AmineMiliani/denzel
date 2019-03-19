const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const imdb = require('./src/imdb');
const CONNECTION_URL = "mongodb+srv://Amine:test@denzel-ya9cl.mongodb.net/database?retryWrites=true";
const DATABASE_NAME = "database";
const DENZEL_IMDB_ID = 'nm0000243';
const actor = DENZEL_IMDB_ID
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(9292, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
      throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("filmography");
    console.log("Connected to `" + DATABASE_NAME + "`!");
  });
});


app.get("/movies/search", (request, response) => {
  collection.find({"metascore":{$gte: parseInt(request.query.metascore)}}).limit(parseInt(request.query.limit)).sort("metascore",-1).toArray((error, result) => {
    if(error){
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.post("/movies", (request, response) => {
  collection.insert(request.body, (error, result) => {
    if(error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});

app.get("/movies", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if(error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.get("/movies/populate", async (request,response) => {
  const movies = await imdb(actor);
  const str_movies = JSON.stringify(movies);
  collection.insertMany(movies,(error,result) =>{
    if(error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});

app.get("/movies/:id", (request, response) => {
  collection.findOne({ "id": request.params.id }, (error, result) => {
    if(error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});



/*
app.get("/movies/search", (request, response) => {
  collection.find({"metascore":{$gte: parseInt(request.query.metascore)}}).limit(parseInt(request.query.limit)).toArray((error, result) => {
    if(error){
      return response.status(500).send(error);
    }
    response.send(result);
  });
});
*/
