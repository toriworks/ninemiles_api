// 전역 앱 설정
global.config = require('./config');

// -------------------------------------------------------------------------------------------
// 의존 라이브러리 설정
var express = require('express')
    , cluster = require('cluster')
    , winston = require('winston')
    , http = require('http')
    , path = require('path')
    , sys = require('sys');

// 로그 처리용 설정
require('./rollingLog.js');


// -------------------------------------------------------------------------------------------
// 공용 변수 설정
var _PORT = config.app.port;
var _LOG_FILE = __dirname + config.logfilepath;
var _LOG_LEVEL = config.loglevel;
var numCPUs = require('os').cpus().length;


// -------------------------------------------------------------------------------------------
// Winston 로깅 라이브러리 설정
//var logger = winston.loggers.add('9miles', {
//    rollingFile : {
//        filename : _LOG_FILE, // files will use filename.<date>.log for all files
//        level : _LOG_LEVEL, // Set your winston log level, same as original file transport
//        timestamp : true, // Set timestamp format/enabled, Same ass original file transport
//        maxFiles : 90, // How many days to keep as back log
//        json : true // Store logging data ins json format
//    }
//});


// -------------------------------------------------------------------------------------------
// 클러스터 구성 및 앱 시작
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();

        worker.on('message', function (msg) {
            if (msg.cmd == 'reached') {
                console.log('Worker %d reached another 10000', msg.workerId);
            }
        });
        worker.on('death', function (worker) {
            console.log('worker' + worker.pid + ' died.');
        });
    }
} else {
    var app = express();
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // 라우팅 할 URL 선언
    require('./routers')(app);


    http.createServer(app).listen(_PORT, function () {
        console.log('Express server listening on port ' + _PORT);
    });
}