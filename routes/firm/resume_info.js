var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const pages=require('../../common/pages');
//管理员登录==>简历信息首页
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p || 1;
    const size=4;
    mysql.query('select count(*) tot from resume',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const page=pages(totNum,p,size);
            mysql.query('select * from resume where company like ? limit ?,?',['%'+search+'%',page.start,page.size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{            
                    res.render('firm/resume_info/index',{
                        data:data,
                        search:search,
                        show:page.show
                    });
                }
            });
        }
    });
    
});

module.exports = router;