var express = require('express');

var router = express.Router();

//反馈信息首页
router.get('/',(req,res,next)=>{
    res.render('student/feedback_info/index');
})
module.exports = router;