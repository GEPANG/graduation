var express = require('express');

var router = express.Router();

//学生登录首页
router.get('/',(req,res,next)=>{
    // console.log(req.session.username);
    let username=req.session.username;
    if(req.session.username){
        res.render('student',{
            username:username
        });
    }else{
        res.send("<script>alert('请先登录');location.href='/';</script>");
    }   
});

//信息阅览
let individualRouter=require('./student/individual');
router.use('/individual',individualRouter);

//企业信息浏览
let enterpriseInfoRouter=require('./student/enterprise_Info');
router.use('/enterpriseInfo',enterpriseInfoRouter);

//招聘信息页
let recruitInfoRouter=require('./student/recruit_info');
router.use('/recruitInfo',recruitInfoRouter);

//招聘信息页
let resumeInfoRouter=require('./student/resume_info');
router.use('/resumeInfo',resumeInfoRouter);

//招聘信息页
let feedbackInfoRouter=require('./student/feedback_info');
router.use('/feedbackInfo',feedbackInfoRouter);
module.exports = router;