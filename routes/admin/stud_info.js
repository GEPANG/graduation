var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');

//加密模块
const crypto=require('crypto');

/*学生信息首页*/
router.get('/',(req,res,next)=>{
    const search=req.query.search || '';
    let p=req.query.p || 1;//第几页
    const size=5;//一页几个
    const start=(p-1)*size;//开始位置
    mysql.query('select count(*) tot from student where username like ? order by id desc',['%'+search+'%'],(err,data)=>{
        if(err){
            console.log(err)
        }else{
            const totNum=data[0].tot;
            const totPages=Math.ceil(totNum/size);
            // console.log(data,totNum,totPages);
            mysql.query('select * from student where username like ? order by id desc limit ?,?',['%'+search+'%',start,size],function(err,data){
                if(err){
                    console.log(err);
                }else{
                    res.render('stud_info/stud_info',{
                        data:data,
                        search:search,
                        p:p,
                        totPages:totPages,
                    });
                }
            })
        }
    })    
})


/*学生信息修改*/
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query(`select * from student where id=${id}`,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('stud_info/edit',{data:data[0]});
        }
    })
})
/*学生信息修改功能*/
router.post('/edit',(req,res,next)=>{    
    const {id,username,sid,gender,age,grade,special,certificate}=req.body;
    // console.log(req.body);
    sql=`
        update student set sid='${sid}',special='${special}',certificate='${certificate}' where id='${id}';
    `;
    mysql.query(sql,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows==1){   
                res.send("<script>alert('更新成功');location.href='/admin/stud_info'</script>");
            }else{
                res.send("<script>alert('更新失败')</script>")
            }
        }
    })
})


/*学生信息删除*/
router.get('/del',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('delete from student where id='+id,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            if(data.affectedRows==1){
                res.send('1');
            }else{
                res.send("0");
            }
        }
    })
})


/*学生信息添加*/
router.get('/add',(req,res,next)=>{
    res.render('stud_info/add');
})
/*学生信息添加功能*/
router.post('/add',(req,res,next)=>{
    const {username,sid,gender,age,grade,special,certificate}=req.body;

    //密码加密
    const md5=crypto.createHash('md5');
    password=md5.update('000000').digest('hex');

    sql=`
        insert into student(username,sid,gender,age,grade,special,certificate,password)
        value('${username}','${sid}','${gender}','${age}','${grade}','${special}','${certificate}','${password}')
    `;  
    mysql.query(`select * from student`,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            let u=0
            data.forEach(item => {
                if(item.username == username){
                    u += 1 
                }
            });
            if(Boolean(u)){
                res.send("<script>alert('学生信息已存在,请进入修改页');history.go(-1)</script>");
            }else{
                mysql.query(sql,(err,data)=>{
                    if(err){
                        console.log(err)
                    }else{         
                        if(data.affectedRows==1){
                            console.log(data)
                            res.send("<script>alert('添加成功');location.href='/admin/stud_info'</script>");
                        }else{
                            res.send("<script>alert('添加失败');history.go(-1)</script>");
                        }
                    }
                });
            }
        }
    })   
})

module.exports = router;