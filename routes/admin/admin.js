var express = require('express');
var router = express.Router();

const mysql=require('../../conf/db');
const moment=require('moment')

//加密模块
const crypto=require('crypto');

/* 管理员查看页面*/
router.get('/', (req, res, next)=>{  
    if(req.session.username){
        const search=req.query.search ? req.query.search : "";
        mysql.query('select * from admin where username like ? order by id desc',[`%${search}%`],function(err,data){
        if(err){
            console.log(err)
        }else{    
            data.forEach(item=>{
                item.time=moment(item.time).format("YYYY-MM-DD HH:mm:ss");
            })  
            res.render('admin/admin',{
                data:data,
                search:search
                }
            );
        }
        });
    }else{
        res.send("<script>alert('请先登录');location.href='/';</script>");
    }         
});

/* 管理员删除页面*/
router.get('/del', (req, res, next)=>{  
    const id=req.query.id;
    mysql.query(`delete from admin where id=${id}`,function(err,data){
        if(err){
          console.log(err);
        }else{
          if(data.affectedRows==1){
              res.send('1');
          }else{
              res.send('0');
          }
        }
    })
});


/*管理员添加页面*/
router.get('/add', (req, res, next)=>{
  res.render('admin/add');
  // res.render('admin/admin');
});
/*管理员添加功能*/
router.post('/add',(req,res,next)=>{
   let {username,password,repassword}=req.body;
   if(username){//判断用户名是否书写
      if(password){//判断密码是否书写
          if(password==repassword){//判断两次密码是否相等         
              //判断用户名是已经注册
              mysql.query('select username from admin where username=?',[username],function(err,data){
                  if(err){
                     console.log(err)
                  }else{
                      if(data.length==0){//没有注册，插入数据
                          const time=Math.round(Date.now());

                          //密码加密
                          const md5=crypto.createHash('md5');
                          password=md5.update(password).digest('hex');
                        //   console.log(password)

                          mysql.query('insert into admin(username,password,time) value(?,?,?)',[username,password,time],function(err,data){
                              if(err){
                                console.log(err);
                              }else{
                                 if(data.affectedRows==1){
                                    res.send("<script>alert('添加成功');location.href='/admin/admin'</script>");
                                 }else{
                                    res.send("<script>alert('添加失败');history.go(-1)</script>");
                                 }
                              }
                          })
                      }else{
                        res.send("<script>alert('用户名已存在，请重新添加');history.go(-1)</script>");
                      }
                  }
              })
          }else{
              res.send("<script>alert('请输入再次输入密码');history.go(-1)</script>")
          }
      }else{
          res.send("<script>alert('请输入密码');history.go(-1)</script>")
      }
   }else{
      res.send("<script>alert('请输入账户名');history.go(-1)</script>")
   }
})

//修改页面
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from admin where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{            
            res.render('admin/edit',{
                data:data[0],
            });
        }
    });
});
router.post('/edit',(req,res,next)=>{   
    const {username,password,repassword}=req.body;
    mysql.query('update admin set password=? where username=?',[password,username],(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows == 1){
                res.send("<script>alert('修改成功');location.href='/admin/admin';</script>");
            }
        }
    })
})

module.exports = router;

