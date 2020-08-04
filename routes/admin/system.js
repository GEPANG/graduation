var express = require('express');
var router = express.Router();

const fs=require('fs');
const path=require('path');

//安装multer模块，图片上传设置
const multer=require('multer');
//设置临时目录
const tmp=multer({dest:"tmp/"});

router.get('/',(req,res,next)=>{
    //读取文件信息
    const info=fs.readFileSync(__dirname+'/../../conf/webConfig.json');
    const data=JSON.parse(info.toString());//转换为对象格式

    res.render('system/index',{
        data:data
    });
});

//系统修改
router.post('/save',tmp.single("logo"),(req,res,next)=>{
    // console.log(req.body);
    // console.log(req.file);
    const imgRes=req.file;
    const {title,keywords,description,copyright,record,logo}=req.body;
    let newPath="";
    if(imgRes){//判断是否修改图片123
        let tmpPath=imgRes.path;//获取图片临时路径
        let ext=path.extname(imgRes.originalname);//获取文件后缀
        // console.log(tmpPath,ext);
        let newName=(new Date().getTime())+Math.random()*10000+ext;//新文件名,防止传入相同的名称
        newPath="/upload/"+newName;//新目录

        //进行文件拷贝====>从临时目录移动到新目录
        let fileDate=fs.readFileSync(tmpPath);//读取文件资源
        fs.writeFileSync(__dirname+"/../../"+newPath,fileDate);//拷贝到新路径的文件下   
    }
    //数据格式化为对象
    let data={
        title:title,
        keywords:keywords,
        description:description,
        copyright:copyright,
        record:record,
        logo:newPath?newPath:logo,//三目运算，修改了图片，图片路径就是新路径否则等于之前的图片
    }
    fs.writeFileSync(__dirname+"/../../conf/webConfig.json",JSON.stringify(data));//格式化数据放入读取文件的目录文件

    if(imgRes){//判断图片是否更改，更改了就删除文件里的图片，改成上传的图片
        fs.unlinkSync(__dirname+'/../../'+logo);
    }
    res.send("<script>alert('更新成功');location.href='/admin/system';</script>");
});

module.exports = router;