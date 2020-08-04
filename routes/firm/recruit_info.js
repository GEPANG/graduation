var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const moment=require('moment');
const pages=require('../../common/pages');


//招聘信息首页
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p || 1;
    const size=4;
    mysql.query('select count(*) tot from recruit',(err,data)=>{
        if(err){
            console.log(err)
        }else{
            const totNum=data[0].tot;
            const page=pages(totNum,p,size);
            mysql.query('select * from recruit where company like ? order by id desc limit ?,?',['%'+search+'%',page.start,page.size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD");
                    });
                    console.log(data[0]);
                    res.render("firm/recruit_info/index",{
                        data:data,
                        search:search,
                        show:page.show
                    });            
                }
            })
        }
    });
    
});

//招聘信息添加页面
router.get('/add',(req,res,next)=>{
    res.render('firm/recruit_info/add');
});
//招聘信息添加功能
router.post('/add',(req,res,next)=>{
    const {company,type,position,brief,email}=req.body;
    const time=(new Date().getTime());

    const sql=`
        insert into recruit(company,type,position,brief,time,email)
        value('${company}','${type}','${position}','${brief}','${time}','${email}')
    `;
    // console.log(sql);
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("<script>alert('添加成功');location.href='/firm/recruitInfo';</script>");
            }else{
                res.send("<script>alert('添加失败');history.go(-1);</script>");
            }
        };
    });
});


//招聘信息修改页面
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from recruit where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('firm/recruit_info/edit',{
                data:data[0]
            });            
        }
    });
})
//招聘信息修改功能
router.post('/edit',(req,res,next)=>{
    const {id,company,type,position,brief,email}=req.body;
    const time=(new Date().getTime());
    const sql=`
        update recruit set company='${company}',type='${type}',position='${position}',
        brief='${brief}',time='${time}',email='${email}' where id='${id}'
    `;
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("<script>alert('修改成功');location.href='/firm/recruitInfo'</script>");
            }else{
                res.send("<script>alert('修改失败');history.go(-1);</script>");
            };
        }
    });
});

module.exports = router;