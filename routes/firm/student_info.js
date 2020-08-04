var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const pages=require('../../common/pages');


//管理员登录==>学生信息首页
router.get('/',(req,res,next)=>{
    const p=req.query.p || 1;
    const size=8;
    mysql.query('select count(*) tot from  student',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const page=pages(totNum,p,size);
            mysql.query('select * from student limit ?,?',[page.start,page.size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render('firm/student_info/index',{
                        data:data,
                        show:page.show
                    });
                }
            }); 
        }
    });
       
});

module.exports = router;