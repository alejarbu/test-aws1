const PORT = 8080;
var http = require('http');
var httpdispatcher = require('httpdispatcher');
var fs = require('fs')
var pixel = fs.readFileSync(__dirname + '/pixel.gif');
var dispatcher = new httpdispatcher();
dispatcher.setStaticDirname(__dirname);
dispatcher.setStatic('resources');

function j2str(jobj) {
    var cache = [];
    var o = JSON.stringify(jobj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
    return o;
}
dispatcher.onGet("/tr", function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'image/gif'
    });
    console.log(j2str(req));
    res.end(pixel, 'binary');
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // res.end(j2str(req));
});
//A sample POST request
/*dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});*/
var server = http.createServer(function handleRequest(request, response) {
    try {
        //console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
});
server.listen(PORT, function() {
    //console.log("Server listening on: http://localhost:%s", PORT);
});