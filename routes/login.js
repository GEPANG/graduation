var express = require('express');

var router = express.Router();
const mysql=require('../conf/db');

//加密模块
const crypto=require('crypto');

//登录首页路由
router.get('/',function(req,res,next){
    //加载登录页
    // res.send('登录页');
    res.render('login');
});
 
// router.get('/student',(req,res,next)=>{
//     res.send('123');
// });

//登录效验
router.post('/check',(req,res,next)=>{
    // console.log(req.body);
    let {username,sel,password}=req.body;
    if(username){
        if(password){            
            //管理员
            if(sel==1){
                const md5=crypto.createHash('md5');
                password=md5.update(password).digest('hex');
                // console.log(password)
                mysql.query("select * from admin where username=? and password=?",[username,password],(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        if(data.length != 0){
                            req.session.username=username;                           
                            res.send("<script>location.href='/admin/'</script>");                           
                        }else{
                            res.send("<script>alert('用户名或密码输入错误');history.go(-1)</script>");
                        }
                    }
                });
            }      

             //学生
            if(sel ==2){   
                const md5=crypto.createHash('md5');
                password=md5.update(password).digest('hex');
                // console.log(password)              
                mysql.query("select * from student where username=? and password=?",[username,password],(err,data)=>{                    
                    if(err){
                        console.log(err);
                    }else{
                        if(data.length != 0){
                            req.session.username=username;
                            res.send("<script>"+"location.href='/student'"+"</script>");
                        }else{
                            res.send("<script>alert('用户名或密码输入错误');history.go(-1)</script>");
                        }
                    }
                });
            }

            //企业人员
            if(sel==3){
                const md5=crypto.createHash('md5');
                password=md5.update(password).digest('hex');
                // console.log(password)                
                mysql.query("select * from enterprise_man where username=? and password=?",[username,password],(err,data)=>{                    
                    if(err){
                        console.log(err);
                    }else{
                        if(data.length != 0){
                            // console.log(data[0].id);
                            req.session.username=username;
                            res.send("<script>location.href='/firm/'</script>");
                        }else{
                            res.send("<script>alert('用户名或密码输入错误');history.go(-1)</script>");
                        }
                    }
                });
            }
        }else{            
            res.send("<script>alert('请输入密码');history.go(-1);</script>");
        }
    }else{        
        res.send("<script>alert('请输入用户名');history.go(-1);</script>");
    }
});

//退出登录
router.get('/logout',(req,res,next)=>{
    req.session.username="";
    res.send("<script>location.href='/'</script>");
});

module.exports = router;
