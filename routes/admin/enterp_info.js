var express = require('express');

var router = express.Router();

//导入mysql
const mysql=require("../../conf/db");
const moment=require("moment");

//企业信息首页
router.get('/',(req,res,next)=>{
    const search=req.query.search?req.query.search:"";
    let p=req.query.p || 1;//第几页
    const size=3;//一页几个
    const start=(p-1)*size;//开始位置
    mysql.query('select count(*) tot from company where cname like ? order by id desc',['%'+search+'%'],(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const totPages=Math.ceil(totNum/size);
            // mysql.query('select * from student where username like ? order by id desc limit ?,?',['%'+search+'%',start,size],
            mysql.query('select * from company where cname like ? order by id desc limit ?,?',['%'+search+'%',start,size],(err,data)=>{        
                if(err){
                    console.log(err);
                }else{
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD");
                    });
                    res.render('enterp_info/enterp_info',{
                        data:data,
                        search,
                        totPages,
                        p
                    });
                }
            })
        }
    })    
});
//企业信息添加首页
router.get('/add',(req,res,next)=>{
    res.render('enterp_info/add');
})

//企业信息添加功能
router.post('/add',(req,res,next)=>{
    const {cname,brief,type,time,fund,address,email}=req.body;
    const sql=`
    insert into company(cname,brief,type,time,fund,address,email) 
    value('${cname}','${brief}','${type}','${time}','${fund}','${address}','${email}')
    `;
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("<script>alert('添加成功');location.href='/admin/enterp_info';</script>");
            }else{
                res.send("<script>alert('添加失败');history.go(-1);</script>");
            }
        }
    })
})
//企业信息删除功能
router.get('/del',(req,res,next)=>{
    const id=req.query.id;

    mysql.query('delete from company where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("1");
            }else{
                res.send("0");
            }
        }
    });
});



module.exports = router;