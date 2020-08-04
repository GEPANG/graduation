
function pages(tot,p,size){
    let start=(p-1)*size; 
    let totpages=Math.ceil(tot/size);
    
    //分页效果
    let show="";
    show +=`<a href="?p=1" class="active">首页</a>`;
    show +=`&nbsp;<a href="?p=${p-1 >= 1 ? p-1 : 1}">上一页</a>`;
    for(var i=2;i<totpages;i++){
        show +=`&nbsp;<a href="#">${i}</a>`;
    }   
    show +=`&nbsp;<a href="?p=${Number(p)+1 <= totpages ? Number(p)+1 : totpages}">下一页</a>`;
    show +=`&nbsp;<a href="?p=${totpages}">尾页</a> `;

    return {
        start:start,
        size:size,
        show:show
    }
}

module.exports=pages