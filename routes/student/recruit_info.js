var express = require('express');

var router = express.Router();
const mysql=require('../../conf/db');
const moment=require('moment');
const fs=require('fs');
const path=require('path');
const multer=require('multer');//图片上传设置
const tmp=multer({dest:"tmp/"});//临时目录

//招聘信息页
router.get('/',(req,res,next)=>{
    const search=req.query.search || "";
    const p=req.query.p||1;
    const size=5;
    const start=(p-1)*size

    mysql.query('select count(*) tot from recruit',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const totNum=data[0].tot;
            const totPages=Math.ceil(totNum/size);
            mysql.query('select * from recruit where position like ? limit ?,?',['%'+search+'%',start,size],(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    data.forEach(item => {
                        item.time=moment(item.time).format("YYYY-MM-DD HH:mm:ss");
                    });
                    res.render('student/recruit_info/index',{
                        data:data,
                        search:search,
                        p:p,
                        totPages:totPages
                    }); 
                }
            });
        }
    });        
});

/*查看招聘详情*/
router.get('/check',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from recruit where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            data.forEach(data=>{
                data.time=moment(data.time).format('YYYY-MM-DD HH:mm:ss');
                // console.log(data.time);
            })
            res.render('student/recruit_info/check',{
                data:data[0]
            });
        }
    });
});

/*简历投递页面*/
router.get('/resume',(req,res,next)=>{
    const id=req.query.id;
    mysql.query('select * from recruit where id='+id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('student/recruit_info/resume',{
                data:data[0]
            });            
        }
    });
});

/*简历投递功能*/
router.post('/resume',tmp.single('img'),(req,res,next)=>{  
    const {company,username,age,position,edu,hobby,certificate,img}=req.body;

    let imgRes=req.file;  //获取图片信息
    let tmpPath=imgRes.path;//文件临时路径  
    let ext=path.extname(imgRes.originalname);//文件后缀名
    let newName=(new Date().getTime()+Math.random()*1000)+ext;//文件改名，以防止多用户上传图片名一致
    let newPath="/upload/student/"+newName;//文件新路劲

    //文件拷贝
    const fileData=fs.readFileSync(tmpPath);    //读取临时文件信息
    fs.writeFileSync(__dirname+'/../../'+newPath,fileData);  //信息写入新文件

    const sql=`
        insert into resume(company,username,age,position,edu,hobby,certificate,img) 
        value('${company}','${username}','${age}','${position}','${edu}','${hobby}','${certificate}','${newPath}')
    `;
    // console.log(sql);
    mysql.query(sql,(err,data)=>{
        console.log(data);
        if(err){
            console.log(err);
        }else{
            console.log(data);
            if(data.affectedRows==1){
                res.send("<script>alert('添加成功');history.go(-1)</script>");
            }else{
                res.send("<script>alert('添加失败');history.go(-1)</script>");
            }            
        } 
    });
});


module.exports = router;