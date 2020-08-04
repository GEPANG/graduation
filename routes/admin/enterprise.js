var express = require('express');

var router = express.Router();

//mysql引入
const mysql=require('../../conf/db');
//moment引入---时间处理
const moment=require('moment');
//crypto---密码加密
const crypto=require('crypto');

/*企业管理员*/
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";

    //分页功能
    const p=req.query.p || 1;//第几页
    const size=5; //每页展示几个
    const start=(p-1)*size;//开始结束位置;

    //计算数据库数据
    mysql.query('select count(*) tot from enterprise_man where username like ? order by id desc',['%'+search+'%'],function(err,data){
        if(err){
            console.log(err);
        }else{           
            const numTotal=data[0].tot; //总个数
            const pageTotal=Math.ceil(numTotal/size);//总页数
            // console.log(numTotal,pageTotal)
            // pages(start,p,pageTotal);

            mysql.query('select * from enterprise_man where username like ? order by id desc limit ?,?',['%'+search+'%',start,size],function(err,data){
                // console.log(data)    
                if(err){
                    console.log(err);
                }else{
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD HH:mm:ss");
                    });
                    res.render('enterprise/enterprise',{
                        data:data,
                        search:search,
                        p:p,
                        pageTotal:pageTotal
                    });
                }
            })
        }
    })    
})

/*删除功能*/
router.get('/enter_del',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('delete from enterprise_man where id=?',[id],function(err,data){
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
})


/*企业管理员添加页面*/
router.get('/add',(req,res,next)=>{
    res.render('enterprise/add');
})
/*企业管理员添加功能*/
router.post('/add',(req,res,next)=>{
    let {username,password,repassword}=req.body;
    if(username){//用户是否输入
        if(password){//密码是否输入
            if(password == repassword){//两次密码是否相等
                mysql.query(`select * from enterprise_man where username='${username}'`,function(err,data){
                    if(err){
                        console.log(err)
                    }else{
                        if(data.length==0){//不存在，插入数据
                            time=Math.round(Date.now());
                            const md5=crypto.createHash('md5');
                            password=md5.update(password).digest('hex');

                            mysql.query('insert into enterprise_man (username,password,time) value(?,?,?)',[username,password,time],function(err,data){
                                // console.log(data)
                                if(err){
                                    console.log(err);
                                }else{
                                    if(data.affectedRows==1){
                                        res.send("<script>alert('添加成功');location.href='/admin/enterprise'</script>");
                                    }else{
                                        res.send("<script>alert('添加失败！');history.go(-1)</script>");
                                    }
                                }
                            })
                        }else{
                            res.send("<script>alert('用户名已存在,请重新输入');history.go(-1)</script>");
                        }
                    }
                })
            }else{
                res.send("<script>alert('两次密码不一致');history.go(-1)</script>");
            }
        }else{
            res.send("<script>alert('请输入密码');history.go(-1)</script>");
        }
    }else{
        res.send("<script>alert('请输入用户名');history.go(-1)</script>");
    }
})

//修改页面
router.get('/edit',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from enterprise_man where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{            
            res.render('enterprise/edit',{
                data:data[0],
            });
        }
    });
});
//修改功能
router.post('/edit',(req,res,next)=>{   
    let {username,password,repassword}=req.body;
    mysql.query('update enterprise_man set password=? where username=?',[password,username],(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data.affectedRows == 1){
                res.send("<script>alert('修改成功');location.href='/admin/enterprise';</script>");
            }
        }
    })
})

module.exports = router;
