var express = require('express');

var router = express.Router();
const mysql=require('../../conf/db');
const pages=require('../../common/pages');

//简历信息
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p || 1;
    const size=4;
    // const start=(p-1)*size;

    mysql.query('select count(*) tot from resume',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            // const totPages=Math.ceil(totNum/size);
            const page=pages(totNum,p,size);
            mysql.query('select * from resume where 1=1 and username like ? limit ?,?',['%'+search+'%',page.start,page.size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{  
                    res.render('student/resume_info/index',{
                        data:data,
                        search:search,
                        show:page.show
                    });
                }
            });
        }
    });    
})



module.exports = router;