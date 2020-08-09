const express = require("express");
const fs = require("fs")
const MongoClient = require("mongodb").MongoClient;
const fcont = require("./fscontainer");
let app = express();
const child_process = require("child_process");





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

app.use("/project", (_, r)=>{
    r.json(new fcont.File(__dirname + "/container"))
});

app.use("/savefile", (req, r)=>{
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });
    req.on("end", ()=>{
        fs.writeFileSync("main.dul", req.rawBody);
    })
});

app.use("/execute", (_, r)=>{
    r.send(child_process.execFileSync(__dirname+"/Dulang"))
});
app.use("/load", (_, r)=>{
    r.send(fs.readFileSync("main.dul"));
});

app.use("/", (_, r)=>{
    r.sendFile(__dirname + "/index.html");
});


app.listen(80);
