var express = require('express')
  , controller = require('./controller/common.js')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals');
 
var app = express();
 
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 
app.get('*', function(req , res, next){
	controller.findController(req, res, next);
});
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});