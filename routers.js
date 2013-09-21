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
    app.get('/account/check_nickname/:nick_name', user_service.check_nickname_duplicate);

    // 이메일 중복 여부를 판단
    app.get('/account/check_email/:email_address/:passwd', user_service.check_email_duplicate);

    // 프로필 정보 입력
    app.post('/account/settings', user_service.set_account_info);
}
