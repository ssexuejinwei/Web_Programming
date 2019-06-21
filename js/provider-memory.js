(function() {
    let model = window.model;
    Object.assign(model, {
        init: function(callback) {
            // console.log("i am in init");
            // console.log(model.data);
            // 读取操作
            let str_data = localStorage.getItem(model.TOKEN);
            // console.log(str_data === null);
            if(str_data === null){
                let add_data= {
                    items: [
                        {msg: "hi,welcome", state: false,color:"#000000"},

                    ],
                    // date: today,
                    filter: 'All'
                };
                str_data = JSON.stringify(add_data);
            }

            let json_data = JSON.parse(str_data);
            model.data = json_data;
            if (callback) callback();
        },
        flush: function(callback) {
            // 写入操作
            let str_data;
            str_data = JSON.stringify(model.data);
            localStorage.setItem(model.TOKEN,str_data);
            if (callback) callback();
        }
    });
})();
