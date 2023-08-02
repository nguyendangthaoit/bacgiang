var fs = require('fs');
console.log("Incrementing release number...");
fs.readFile('src/metadata.json',function(err,content){
    if(err) throw err;
    var metadata = JSON.parse(content);
    metadata.release = metadata.release + 1;
    metadata.build = 1;
    fs.writeFile('src/metadata.json',JSON.stringify(metadata),function(err){
        if(err) throw err;
        console.log("Current release number: " + metadata.release);
    })
});