/**
 *
 *
 * routers.js
 */


// -------------------------------------------------------------------------------------------
// 의존 라이브러리 설정
var feed_service = require('./routes/feed_service'),
    user_service = require('./routes/user_service');


module.exports = function (app) {

    // 닉네임 중복 여부를 판단
    app.get('/account/check_nickname_duplicate/:nick_name', user_service.check_nickname_duplicate);

    // 입력받은 이메일이 사용중인지를 판단
    app.get('/account/check_email_duplicate/:email_address', user_service.check_email_duplicate);

    // 입력받은 이메일에 비밀번호가 정확하게 맞는지를 판단
    app.get('/account/check_email_match/:email_address/:passwd', user_service.check_email_match);

    // 프로필 정보 입력
    app.post('/account/settings', user_service.set_account_info);

}
