let time = new Date();
let day = ("0" + time.getDate()).slice(-2);
let month = ("0" + (time.getMonth() + 1)).slice(-2);
let today = time.getFullYear() + "-" + (month) + "-" + (day);

window.model = {
    //data 的内容items,init将数据读出函数，flush将数据存储函数
    data: {
        items: [
             {msg:"hello",state:false,color:"#000000"},
             {msg:"hello",state:false,color:"#000000"}
        ],
        filter: 'All'
    },
    TOKEN: 'TodoMVC-'+today,
    init:null,
    flush:null
};
