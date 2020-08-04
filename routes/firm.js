var express = require('express');

var router = express.Router();

//企业管理员登录页
router.get('/',(req,res,next)=>{
    // console.log(req.session.username);
    res.render('firm/index');
});

//企业管理员==>企业信息页
let enterpriseInfoRouter=require('./firm/enterprise_info');
router.use('/enterpriseInfo',enterpriseInfoRouter);

//企业管理员==>企业信息页
let recruitInfoRouter=require('./firm/recruit_info');
router.use('/recruitInfo',recruitInfoRouter);

//企业管理员==>学生信息页
let studentInfoRouter=require('./firm/student_info');
router.use('/studentInfo',studentInfoRouter);

//企业管理员==>学生信息页
let resumeInfoRouter=require('./firm/resume_info');
router.use('/resumeInfo',resumeInfoRouter);


module.exports = router;