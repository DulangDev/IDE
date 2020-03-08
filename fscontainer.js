const fs = require("fs");

class File{
    constructor(dir) {
        if(fs.statSync(dir).isDirectory()){
            this.children = fs.readdirSync(dir).filter(name => name.charAt(0) !== '.').map( node=>new File(dir + "/"+ node));
            this.type = "dir";
        } else {
            this.type = "file";
        }
        this.path = dir;
        this.name = dir.split("/")[ dir.split("/").length - 1 ]
    }

}

module.exports.File = File;
