const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const fcont = require("./fscontainer");
let app = express();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });



app.use(express.static(__dirname + "/public"));

/*mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    let tasks = client.db("tasks");
    app.use("/tasks", (_, res)=>{
        tasks.collection("tasks").find({}).toArray(function(err, users){
            if(err) return console.log(err);
            res.json(users)
        });
    });
    app.use("/", (_, r)=>{
        r.sendFile(__dirname + "/land.html")
    });
});*/

app.use("/static", express.static(__dirname));
app.use("/land", (_, r)=>{
    r.sendFile(__dirname + "/index.html");
});

app.use("/project", (_, r)=>{
    r.json(new fcont.File(__dirname + "/container"))
});



app.listen(9087);
