var express = require('express');

var router = express.Router();
const mysql=require('../../conf/db');

//个人信息页
router.get('/',(req,res,next)=>{
    let search=req.query.search || "";
    let username=req.session.username;
    // console.log(username);
    const p=req.query.p || 1;
    const size=5;
    const start=(p-1)*size;
    
    mysql.query('select count(*) tot from student',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const totPages=Math.ceil(totNum/size);
            mysql.query('select * from student where username like ? order by id desc limit ?,?',['%'+search+'%',start,size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render('student/individual',{
                        data:data,
                        search:search,
                        p:p,
                        totPages:totPages,
                        username:username
                    });
                }
            });
        }
    })    
});

//个人信息修改页面
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from student where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('student/edit.ejs',{
                data:data[0]
            });
        }
    });
});
//个人信息修改功能
router.post('/edit',(req,res,next)=>{
    // console.log(req.body);
    const {id,username,sid,gender,age,grade,special,certificate,password}=req.body;
    sql=`
        update student set username='${username}',sid='${sid}',gender='${gender}',
        age='${age}',grade='${grade}',special='${special}',certificate='${certificate}',password='${password}' 
        where id='${id}'
    `;
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){
                res.send("<script>alert('修改成功');location.href='/student/individual';</script>");
            }else{
                res.send("<script>alert('修改失败');history.go(-1);</script>");
            }
        }
    })
});

//个人信息添加页面
router.get('/add',(req,res,next)=>{
    res.render('student/add');
});
//个人信息添加功能
router.post('/add',(req,res,next)=>{
    const {username,sid,gender,age,grade,special,certificate}=req.body;
    // console.log(req.body);
    const sql=`
        insert into student(username,sid,gender,age,grade,special,certificate) 
        value('${username}','${sid}','${gender}','${age}','${grade}','${special}','${certificate}') 
    `;
    // console.log(sql);
    mysql.query('select username from student where username=?',[username],(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.length!=0){
                res.send("<script>alert('你的信息已存在');location.href='/student/individual'</script>");
            }else{
                mysql.query(sql,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        if(data.affectedRows==1){
                            res.send("<script>alert('添加成功');location.href='/student/individual'</script>");
                        }else{
                            res.send("<script>alert('添加失败');history.go(-1);</script>");
                        };
                    }
                });
            };
        }
    })  
});


module.exports = router;