var express = require('express');

var router = express.Router();
const mysql=require('../../conf/db');
// const pages=require('../../common/pages');
const moment = require('moment')

//企业信息首页
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p || 1;
    const size=5;
    const start=(p-1)*size;

    mysql.query('select count(*) tot from company',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const totPages=Math.ceil(totNum/size);
            // const totNum=data[0].tot;
            // const page=pages(totNum,p,size);          
            mysql.query('select * from company where cname like ? limit ?,?',['%'+search+'%',start,size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{            
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD");
                    });
                    res.render('student/enterprise_info/index',{
                        data:data,
                        // show:page.show
                        totPages:totPages,
                        p:p,
                        search:search 
                    });
                }
            });
        }
    });  
});

//企业信息首查看
router.get('/check',(req,res,next)=>{
    const id=req.query.id;     
    mysql.query('select * from company where id=?',[id],(err,data)=>{
        if(err){
            console.log(err);
        }else{            
            res.render('student/enterprise_info/check',{
                data:data[0],
            })
        }
    });
});
module.exports = router;