var express = require('express')
  , routes = require('./routes/common.js')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals');
 
var app = express();
var MemStore = express.session.MemoryStore;
 
// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.session({secret: 'secret_key', store: MemStore({
  reapInterval: 60000 * 10
})}));
app.use(app.router);
app.engine('ejs', engine);
/* 밑에 *때문에 이렇게 안주면 js나 css,font,images를 찾지 못한다. 된장먹을  */
app.all("/js/*", express.static(path.join(__dirname, 'public')));
app.all("/css/*", express.static(path.join(__dirname, 'public')));
app.all("/font/*", express.static(path.join(__dirname, 'public')));
app.all("/images/*", express.static(path.join(__dirname, 'public')));

app.all("*", function(req , res, next){
	routes.findRoutes(req, res, next);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});