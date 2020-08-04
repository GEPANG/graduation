var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const pages=require('../../common/pages');
const moment=require('moment');

//企业信息首页
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p || 1;
    const size=4;    
    mysql.query('select count(*) tot from company',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const page=pages(totNum,p,size);
            mysql.query('select * from company where cname like ? order by id desc limit ?,?',['%'+search+'%',page.start,page.size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    data.forEach(item=>{
                        item.time=moment(item.time).format("YYYY-MM-DD");
                    })
                    res.render('firm/enterprise_info/index',{
                        data:data,
                        search:search,
                        show:page.show
                    });
                }
            });
        }
    });
    
});

//企业信息添加页面
router.get('/add',(req,res,next)=>{
    res.render('firm/enterprise_info/add');
});
//企业信息添加功能
router.post('/add',(req,res,next)=>{ 
    const {cname,brief,type,time,fund,address,email}=req.body;

    const sql=`insert into company(cname,brief,type,time,fund,address,email) 
    value('${cname}','${brief}','${type}','${time}','${fund}','${address}','${email}')`;

    mysql.query('select * from company where cname=?',[cname],(err,data)=>{
        if(err){
            console.log(err);
        }else{
           if(data.length!=0){
                res.send("<script>alert('公司信息已存在');history.go(-1)</script>");
            }else{
                mysql.query(sql,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{            
                        if(data.affectedRows==1){
                            res.send("<script>alert('添加成功');location.href='/firm/enterpriseInfo'</script>");
                        }else{
                            res.send("<script>alert('添加失败');history.go(-1)</script>");
                        }            
                    }
                });
            }
        }
    });    
});


//企业信息查看页面
router.get('/check',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from company where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('firm/enterprise_info/check',{
                data:data[0]
            });
        }
    });
});

//企业信息修改页面
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from company where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(data);
            res.render('firm/enterprise_info/edit',{
                data:data[0]
            });
        }
    });
});
//企业信息修改功能
router.post('/edit',(req,res,next)=>{
    const {id,cname,brief,type,time,fund,address,email}=req.body;
    const sql=`
        update company set cname='${cname}',brief='${brief}',type='${type}',
        time='${time}',fund='${fund}',address='${address}',email='${email}'
        where id='${id}'
    `;
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("<script>alert('修改成功');location.href='/firm/enterpriseInfo'</script>");
            }else{
                res.send("<script>alert('修改失败');history.go(-1)</script>");
            }            
        }
    });
});


module.exports = router;