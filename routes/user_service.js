/**
 * 회원 관련 서비스
 */
require('date-utils');


//-----------------------------------------------------------------------------
// MONGODB
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("NineMiles");
    db.collection('account', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist.");
        }
    });
});


//-----------------------------------------------------------------------------
// REDIS
var redis = require('redis')
    , client = redis.createClient();


//-----------------------------------------------------------------------------
// 리턴 패킷용 유틸
var _packet_util = require('../util/return_packet');


//-----------------------------------------------------------------------------
// 인증 방법에 관한 상수
var AUTH_PATH_EMAIL = 'E';
var AUTH_PATH_FACEBOOK = 'F';
var AUTH_PATH_TWITTER = 'T';
var AUTH_PATH_GOOGLE = 'G';

// 남여 성별 구분에 관한 상수
var MALE = 'M';
var FEMALE = 'F';
var NOT_CONFIRM = 'A';

// 에러코드 
var SUCCESS = '200';
var FAIL = '500';



exports.check_nickname_duplicate = function (req, res) {
    // 파라미터 얻기


};


// 이메일 중복여부를 체크한다.
exports.check_email_duplicate = function (req, res) {
    // 파라미터 얻기
    var email_address = req.params.email_address;
    var passwd = req.params.passwd;
    console.log('####NINE:email_address called...' + email_address + '<<END');
    console.log('####NINE:passwd called...' + passwd + '<<END');
    
    
    db.collection('account', function(err, collection) {
    	collection.count({'email_address':email_address, 'passwd':passwd}, function(err, item) {
    		if(!err) {
    			res.send(200, _packet_util.make_return_packet('T', SUCCESS, '[{\"count\":' + item + '}]'));   
    		} else {
    			res.send(200, _packet_util.make_return_packet('F', FAIL, 'no data'));
    		}
    	});
    });
        
};


// 회원정보 입력
exports.set_account_info = function (req, res) {
    // 별명, 실명, 비밀번호, 이메일, 성별, 인증방법을 파라미터로 받음
    var name_nick = req.param('name_nick', null);
    var name_real = req.param('name_real', null);
    var passwd = req.param('passwd', null);
    var email_address = req.param('email_address', null);
    var gender = req.param('gender', NOT_CONFIRM);
    var auth_path = req.param('auth_path', AUTH_PATH_EMAIL);

    // Push용 단말기 아이디를 받음
    var device_uuid = req.param('device_uuid', null);


    var return_msg = '';
    if (null == name_nick || name_real == null || passwd == null || email_address == null) {
        // 에러 상황이므로 에러를 리턴함
        return_msg = _packet_util.make_return_packet('F', '500', '');
    } else {
        // 현재 날짜를 구함
        var dt = new Date();
        var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');

        db.collection('account', function(err, collection) {
            doc = {
                "name_nick": name_nick,             // -- 별명
                "name_real": name_real,             // -- 실명
                "passwd": passwd,                   // -- 비밀번호
                "email_address": email_address,     // -- 이메일 주소
                "gender": gender,                   // -- 성별
                "auth_path": auth_path,             // -- 인증경로
                "auth_complete": "N",               // -- 인증완료여부
                "device_uuid": device_uuid,         // -- 디바이스 아이디
                "profile_image_url": '',            // -- 프로필 사진 경로
                "profile_banner_url": '',           // -- 프로필 배경 사진 경로
                "profile_background_color": '',     // -- 프로필 배경
                "description": '',                  // -- 소개정보
                "following": true,                  // -- 팔로잉 허용 여부
                "followers_count": 0,               // -- 팔로워 수(내가 따르는)
                "followees_count": 0,               // -- 팔로이 수(나를 따르는)
                "notifications": true,              // -- 알림 허용 여부
                "regdate": d
            };

            collection.insert(doc, function(err, result) {
                if(!err) {
                    collection.findOne({'email_address':email_address}, function(err, item) {
                        if(!err) {
                        	// JSON 문자열로 회원정보 출력 
                        	var account_info = JSON.stringify(item);
                        	
                            // 입력된 회원의 _id를 얻음
                        	var mongodb_id = item._id;
                        	
                        	// 얻은 _id를 REDIS에 넣음
                        	//client.set("uid:" + mongodb_id + ":account", account_info, redis.print);
                        	client.
                            res.send(200, _packet_util.make_return_packet('T', SUCCESS, '[{\"account\":' + account_info + '}]'));
                        } else {
                            res.send(200, _packet_util.make_return_packet('F', FAIL, 'insert fail'));
                        }
                    });
                } else {
                    res.send(200, _packet_util.make_return_packet('F', FAIL, 'insert fail'));
                }
            });
        });


    } // end of if
};