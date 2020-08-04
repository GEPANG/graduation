var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const moment=require("moment");

//招聘信息管理
router.get('/',(req,res,next)=>{    
    const search=req.query.search || "";

    const p=req.query.p || 1;
    const size=4;
    const start=(p-1)*size;
    
    mysql.query('select count(*) tot from recruit',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;     
            const totPages=Math.ceil(totNum/size);
            mysql.query('select * from recruit where company like ? order by id desc limit ?,?',['%'+search+'%',start,size],(err,data)=>{
                if(err){
                    console.log(err)
                }else{           
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD");
                    });
                    res.render('recruit_info/recruit_info',{
                        data:data,
                        search:search,
                        p:p,
                        totPages:totPages
                    });
                }
            });
        }
    })    
});
//删除招聘信息管理
router.get('/del',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('delete from recruit where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send('1');
            }else{
                res.send('0');
            }
        }
    });
})
module.exports = router;
