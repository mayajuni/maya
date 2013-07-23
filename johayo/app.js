var express = require('express')
  , routes = require('./routes/common.js')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , pro = require("./util/property.js");
 
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
/* 세션 사용을 위한 것이다 뒤에 pro.session이 부분은 나만 알아야되기때문에 이렇게 변경 */
app.use(express.cookieSession({secret: pro.sessionSecret()}));
app.use(app.router);
app.engine('ejs', engine);
/* 밑에 *때문에 이렇게 안주면 js나 css,font,images를 찾지 못한다. 된장먹을  */
app.all("/js/*", express.static(path.join(__dirname, 'public')));
app.all("/css/*", express.static(path.join(__dirname, 'public')));
app.all("/font/*", express.static(path.join(__dirname, 'public')));
app.all("/images/*", express.static(path.join(__dirname, 'public')));
app.all("/smartEditorBasic2/*", express.static(path.join(__dirname, 'public')));

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