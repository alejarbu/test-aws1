//Lets require/import the HTTP module
var http = require('http');
//Dispatcher initialize
var httpdispatcher = require('httpdispatcher');
var dispatcher = new httpdispatcher();
//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStaticDirname(__dirname);
dispatcher.setStatic('resources');
//Filesystem access to get the pixel in response
var fs = require('fs'),
    pixel = fs.readFileSync(__dirname + '/pixel.gif')
//Lets define a port we want to listen to
const PORT = 8080;
//Lets use our dispatcher
function handleRequest(request, response) {
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}
dispatcher.onGet("/tr", function(req, res) {
    console.log(JSON.stringify(req));
    res.end(pixel, 'binary');
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end('Page One');
});
dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('welcome');
});
//A sample POST request
/*dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});*/
//Create a server
var server = http.createServer(handleRequest);
//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});