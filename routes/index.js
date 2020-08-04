var express = require('express');

var router = express.Router();
//后台首页路由
router.get('/',function(req,res,next){
    //加载对应的后台页面
    if(req.session.username){
        res.render('index');
    }else{
        res.send("<script>alert('请先登录');location.href='/'</script>");
    }
});

//管理员管理
let adminRouter=require('./admin/admin');
router.use('/admin',adminRouter);

//企业管理员管理
let enterpriseRouter=require('./admin/enterprise');
router.use('/enterprise',enterpriseRouter);

//学生信息管理
let studinfoRouter=require('./admin/stud_info');
router.use('/stud_info',studinfoRouter);

//企业信息管理
let enterpinfoRouter=require('./admin/enterp_info');
router.use('/enterp_info',enterpinfoRouter);

//招聘信息管理
let recruitinfoRouter=require('./admin/recruit_info');
router.use('/recruit_info',recruitinfoRouter);

//系统设置
let systemRouter=require('./admin/system');
router.use('/system',systemRouter);


module.exports = router;
