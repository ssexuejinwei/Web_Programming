//全局变量


//msg 存储的是todo的信息，state存储的是是否完成，true表示完成了
// let item1 = {msg:"hello",state:false};
// let item2 = {msg:"hello",state:false};
// let items = [item1,item2];
let items = [];
let todoNum = 0;
let data ={};
let date;
let $ =function(selector){
    return document.querySelector(selector);
};

let $All =function(selector){
    return document.querySelectorAll(selector);
};

window.onload = function () {
    // localStorage.clear();
    //设置初始日期
    let time = new Date();
    let day = ("0" + time.getDate()).slice(-2);
    let month = ("0" + (time.getMonth() + 1)).slice(-2);
    let today = time.getFullYear() + "-" + (month) + "-" + (day);
    $(".input-date").value = today;
    date = today;

    //添加手机的摇一摇事件 --更换背景颜色
    //背景颜色数组
    $('.input-color').classList.add("hidden");
    let backgroundColor = ["aliceblue","antiquewhite","azure","ghostwhite","white","lightgoldenrodyellow","lightcoral"];
    let motionNum = 0;
    if(window.DeviceMotionEvent){

        let speed = 15;
        let x = y = z = lastX = lastY = lastZ = 0;
        let currhandle = 0;
        window.addEventListener('devicemotion', function(e){
            // console.log(motionNum);

            // alert("我在这里");
            //各个方向的加速度
            var acceleration = e.accelerationIncludingGravity;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            // console.log("i am in jiasudu");
            if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed || Math.abs(z-lastZ) > speed+10) {
                // alert("Wozai zheli ");
                //这里是可以进来的
                if(currhandle==0){
                    //摇一摇事件触发后执行操作
                    motionNum++;
                    if(motionNum >= 20){
                        if(motionNum === 20){
                            alert("别摇了,手机累了,自己去挑背景颜色把!");
                            $('.input-color').classList.remove("hidden");

                        }
                        return;
                    }
                    // alert(backgroundColor[Math.round(Math.random()*10)%5]);
                    //颜色正确取出
                    $('body').style.backgroundColor = backgroundColor[Math.round(Math.random()*10)%backgroundColor.length];
                    currhandle = 0;
                }
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        }, false);
    }
    else{
        alert("您的设备不支持重力感应事件！")
    }

    $('.input-color').addEventListener("change",function () {
       $("body").style.backgroundColor = this.value;
    });
    // console.log(backgroundColor[Math.round(Math.random()*10)%5]);
   // 回调函数
    model.init(function () {
        // console.log("i am in init callback");
        data = model.data;
        items = data.items;
        // date = data.date;
        //绑定事件
        // $(".confirm").addEventListener("click",function () {
        //     let msg_input = $(".input-todo");
        //     if( msg_input.value === ""){
        //         alert("Input can not be empty");
        //         return;
        //     }
        //     let new_item ={msg:msg_input.value,state:false};
        //     items.push(new_item);
        //     // 初始化输入框
        //     msg_input.value = "";
        //     msg_input.focus();
        //     update();
        // });

        $(".input-todo").addEventListener("keyup",function (event) {
            let msg_input = $(".input-todo");
            if(event.keyCode == 13){
                let new_item ={msg:msg_input.value,state:false};
                items.push(new_item);
                // 初始化输入框
                msg_input.value = "";
                msg_input.focus();
                update();
            }

        });

        //全选单选框
        $(".select-all").addEventListener("change",function () {
            // console.log("i am here");
            // console.log(this.checked);
            let nodes = $All("ul li .todo_checkBox");
            if(this.checked ===true){
                //全选--全部标记为完成
                todoNum = 0;
                items.forEach(function (it) {
                    if(!it.state){
                        it.state =true;
                    }
                });
            }
            else{
                //全选取消 --全部标记为未完成
                todoNum =items.length;
                items.forEach(function (it) {
                    if(it.state){
                        it.state = false;
                    }
                });
            }
            update();
        });

        //清除已完成的按钮
        $(".clear-completed").addEventListener("click",function () {
            // console.log(items);
            for(let i = 0; i < items.length; i++){
                if(items[i].state){
                    items.splice(i,1);
                    i--;
                    // continue;
                    // console.log(i,items);
                }
            }
            update();
            // items.forEach(function(it, index) {
            //     console.log(index);
            //     if (it.state) {
            //         items.splice(index, 1);
            //     }
            //     console.log(it);
            // });

        });

        //filters
        let filters = $All(".filters a");
        filters.forEach(function (filter,index) {
            filter.addEventListener("click",function () {
                data.filter = filter.innerHTML;
                filters.forEach(function (item) {
                    item.classList.remove("selected");
                });
                this.classList.add("selected");
                // console.log(filter.innerHTML);
                update();
            })
        });
        update();

        //date
        let date_input =$(".input-date");
        date_input.addEventListener("change",function () {
            // console.log("i am in listen");
            date = this.value;
            model.TOKEN = "TodoMVC-"+date;
            model.init(function () {
                // console.log("i am in init callback");
                data = model.data;
                if(model.data == null){
                    data.items.push({"msg":"welcome to MVC","state":true});
                }
                items = data.items;
                // console.log(data);
            });
            update();
        });

    });
};

let update = function () {

    data.items = items;
    model.flush();

    todoNum = 0;
    let haveCompleted = 0;

    // items.forEach(function (it) {
    //     if(!it.state){
    //         todoNum++;
    //     }
    // });
    // $(".todo-num").innerHTML = todoNum +" items left";

    //清空原列表
    let ul = $(".todo-list");
    // while(ul.firstChild !== null ) {
    //     ul.removeChild(ul.firstChild);
    // }
    ul.innerHTML="";

    //更新Filters
    $All(".filters a").forEach(function (item) {
        item.classList.remove("selected");
    });
    $("."+data.filter).classList.add("selected");

    //全选按钮的显示
    let all_select =$(".select-all");
    if(items.length === 0){
        all_select.classList.add("hidden");
    }
    else{
        if(all_select.classList.contains("hidden")){
            all_select.classList.remove("hidden");
        }
    }



    // console.log(ul.childNodes);
    //遍历数据源
    for(let i = 0; i < items.length; i++) {
        // if(data.date == )
        if (!items[i].state) {
            todoNum++;
        }
        if (data.filter === "All"
            || (data.filter === "Active" && !items[i].state)
            || (data.filter === "Completed" && items[i].state)) {
            let todo_list = $('.todo-list');
            let msg = items[i].msg;
            let state = items[i].state;


            // if( msg_input.value == // console.log(i); ""){
            //     alert("Input can not be empty");
            //     return;
            // }

            /**更新源数据**/
            // item.msg = msg_input.value;
            // item.state = false;
            // items.append(item);
            // todoNum++;


            /**生成需要结点**/


            //todo li 内容
            let new_todo_li = document.createElement("li");
            // new_todo.innerHTML = msg_input.value;
            new_todo_li.id = "todo" + i.toString();
            new_todo_li.className = "todo-li";

            if (state === true) {
                // console.log("update");
                // console.log(items[i].state);
                // console.log(window.getComputedStyle(new_todo_li).getPropertyValue("textDecoration"));
                haveCompleted = 1;
                new_todo_li.classList.add("completed");
            }


            new_todo_li.style.color = items[i].color;

            //是否完成的checkBox
            let newtodo_checkBox = document.createElement("input");
            newtodo_checkBox.type = "checkbox";
            newtodo_checkBox.className = "todo-checkBox";

            newtodo_checkBox.checked = state;

            //显示的label
            let newtodo_label = document.createElement("label");
            newtodo_label.innerHTML = msg;
            newtodo_label.className ="todo-label";

            //上移Button

            let up_todo_button = document.createElement("button");
            up_todo_button.className = "todo-up-button";
            // up_todo_button.innerHTML = "⬆";


            //下移button
            let down_todo_button = document.createElement("button");
            down_todo_button.className = "todo-down-button";
            // down_todo_button.innerHTML = "⬇";


            //颜色选择input
            let color_todo_input = document.createElement("input");
            color_todo_input.type = "color";
            color_todo_input.className = "todo_color-input";
            color_todo_input.value = items[i].color;

            //删除button
            let delete_todo_button = document.createElement("button");
            // delete_todo_button.innerHTML = "X";
            delete_todo_button.className = "todo-del-button";
            delete_todo_button.style.color = items[i].color;

            /**绑定事件**/
            //删除按钮
            delete_todo_button.addEventListener("click", function () {
                items.splice(i, 1);
                update();
            });

            //完成单选框
            newtodo_checkBox.addEventListener("change", function () {
                if (new_todo_li.classList.contains("completed")) {
                    new_todo_li.classList.remove("completed");
                } else {
                    new_todo_li.classList.add("completed");
                }
                // console.log(new_todo_li.classList);
                items[i].state = !items[i].state;
                // if(!items[i].state){
                //     new_todo_li.style.textDecoration = "line-through";
                //
                //     items[i].state = !items[i].state;
                // }
                // else{
                //     new_todo_li.style.textDecoration = "None";
                //     items[i].state = !items[i].state;
                // }
                // console.log(items[i].state);
                // console.log(new_todo_li.style.textDecoration);
                // console.log(" iam here");


                update();
                // $(".todo-num").innerHTML = todoNum +"items left";
            });


            //长按进入编辑
            let timeOutEvent;
            let touchEvent = {
                touchstart: function (e) {
                    timeOutEvent = setTimeout(function () {
                        //此处为长按事件
                        var edit_input = document.createElement("input");
                        var is_finish = false;

                        // edit_input.autofocus = true;
                        edit_input.type = "text";
                        edit_input.value = newtodo_label.innerHTML;
                        edit_input.className = "edit-input";
                        edit_input.focus();

                        // console.log(ul.childNodes);
                        function dofinish() {
                            if (is_finish) {
                                update();
                                return;
                            }
                            is_finish = true;
                            // newtodo_label.innerHTML = edit_input.value;
                            // console.log(new_todo.childNodes);
                            // console.log(edit_input.parentNode);
                            items[i].msg = edit_input.value;
                            newtodo_label.removeChild(edit_input);
                        }

                        edit_input.addEventListener("blur", function () {
                            // new_todo.appendChild(edit_input);
                            dofinish();
                        });
                        edit_input.addEventListener("keyup", function (event) {
                            // new_todo.appendChild(edit_input);
                            if (event.keyCode === 13) {
                                dofinish();
                            }
                        });
                        newtodo_label.appendChild(edit_input);
                    }, 500);
                },
                touchmove: function (e) {
                    // 长按过程中，手指不能移动，若移动则清除定时器，中断长按逻辑
                    clearTimeout(timeOutEvent);
                    e.preventDefault();
                    // timeOutEvent = 0;
                },
                touchend: function (e) {
                    clearTimeout(timeOutEvent);
                }
            };
            newtodo_label.addEventListener("touchstart", touchEvent.touchstart);
            newtodo_label.addEventListener("touchmove", touchEvent.touchmove);
            newtodo_label.addEventListener("touchend", touchEvent.touchend);

            //更改颜色
            color_todo_input.addEventListener("change",function () {
                // console.log(this.value);
                items[i].color = this.value;
                update();
            });


            //上移下移
            //要考虑到越在数组后面，其元素越再上面
            if( i !== items.length -1){
                up_todo_button.addEventListener("click",function () {
                    let temp = items[i];
                    items[i] = items[i+1];
                    items[i+1] = temp;
                    update();
                });
            }

            if( i !== 0){
                down_todo_button.addEventListener("click",function () {

                    let temp = items[i];
                    items[i] = items[i-1];
                    items[i-1] = temp;
                    update();
                });
            }



            /**添加节点**/
            todo_list.insertBefore(new_todo_li, todo_list.firstChild);
            new_todo_li.appendChild(newtodo_checkBox);
            new_todo_li.appendChild(newtodo_label);
            if(i !== 0){
                new_todo_li.appendChild(down_todo_button);
            }
            if(i !== items.length-1){
                new_todo_li.appendChild(up_todo_button);
            }
            new_todo_li.appendChild(delete_todo_button);
            new_todo_li.appendChild(color_todo_input);


            // ol.innerHTML += ol.innerHTML + "<input class=\"choose\" type=\"checkbox\"> <li>" + msg_input.value+ "</li>";

            // todoNum++;
            // update();
        }
    }

    //clear按钮的显示
    let button = $('.clear-completed');
    // console.log(todoNum);
    if(haveCompleted){
        // console.log("Yincang ");
        if(button.classList.contains("hidden")){
            button.classList.remove("hidden");
        }
    }
    else{
        // console.log("显示");
        button.classList.add("hidden");
    }

    //footer数目提醒
    $(".todo-num").innerHTML = (todoNum||'No') + (todoNum>1?" items":" item")+" left";
};






// let addTodoUI = function (item) {
//     // let msg_input = $(".input-todo");
//     let todo_list = $('.todo-list');
//     let msg = item.msg;
//     let state = item.state;
//     // if( msg_input.value == ""){
//     //     alert("Input can not be empty");
//     //     return;
//     // }
//
//     /**更新源数据**/
//     // item.msg = msg_input.value;
//     // item.state = false;
//     // items.append(item);
//     // todoNum++;
//
//
//     /**生成需要结点**/
//     //是否完成
//     let newtodo_checkBox = document.createElement("input");
//     newtodo_checkBox.type = "checkbox";
//     newtodo_checkBox.className = "todo_checkBox";
//     newtodo_checkBox.value = state;
//
//
//     //todo内容
//     let new_todo = document.createElement("li");
//     // new_todo.innerHTML = msg_input.value;
//     new_todo.innerHTML = msg;
//     if(state === true){
//         new_todo.classList.add("completed");
//     }
//
//     //删除button
//     let delete_todo_button = document.createElement("button");
//     delete_todo_button.innerHTML = "X";
//
//
//     /**绑定事件**/
//     //删除按钮
//     delete_todo_button.addEventListener("click",deleteTodo);
//     //完成单选框
//     newtodo_checkBox.addEventListener("change",function () {
//         if(this.parentNode.classList.contains("completed")){
//             this.parentNode.classList.remove("completed");
//             todoNum++;
//         }
//         else
//         {
//             this.parentNode.classList.add("completed");
//             todoNum--;
//         }
//         update();
//         // $(".todo-num").innerHTML = todoNum +"items left";
//     });
//     //全选单选框
//     $(".select-all").addEventListener("change",function () {
//         // console.log("i am here");
//         // console.log(this.checked);
//         let nodes = $All("ul li .todo_checkBox");
//         if(this.checked === true){
//             // console.log(nodes);
//             for(let i =0;i < nodes.length; i++){
//                 if(nodes[i].checked === false){
//                     nodes[i].checked = true;
//                 }
//             }
//             todoNum = 0;
//         }
//         else {
//             for (let i = 0; i < nodes.length; i++) {
//                 if (nodes[i].checked === true) {
//                     nodes[i].checked = false;
//                     todoNum++;
//                 }
//             }
//         }
//         update();
//     });
//
//     //长按进入编辑
//     let timeOutEvent =0;
//     let touchEvent = {
//         touchstart: function(e){
//             timeOutEvent = setTimeout(function(){
//                 //此处为长按事件
//                 timeOutEvent = 0;
//
//                 let edit_input = document.createElement("input");
//                 let is_finish = false;
//
//                 edit_input.autofocus = true;
//                 edit_input.type = "text";
//                 edit_input.value = new_todo.innerText.substring(0,new_todo.innerText.length-1);
//
//                 let dofinish = function(){
//                     if(is_finish){
//                         return;
//                     }
//                     is_finish = true;
//                     new_todo.innerText = edit_input.value;
//                     console.log(new_todo.childNodes);
//                     edit_input.parentNode.removeChild(edit_input);
//                 };
//                 edit_input.addEventListener("blur",function (event) {
//                     dofinish();
//                 });
//                 new_todo.appendChild(edit_input);
//             },500);
//         },
//         touchmove: function(e){
//             clearTimeout(timeOutEvent);
//             timeOutEvent = 0;
//         },
//         touchend:function (e) {
//             clearTimeout(timeOutEvent);
//             if(timeOutEvent !== 0){
//                 return;
//             }
//         }
//     };
//     new_todo.addEventListener("touchstart",touchEvent.touchstart);
//     new_todo.addEventListener("touchmove",touchEvent.touchmove);
//     new_todo.addEventListener("touchend",touchEvent.touchend);
//
//
//
//
//     /**添加节点**/
//     todo_list.insertBefore(new_todo,todo_list.firstChild);
//     new_todo.insertBefore(newtodo_checkBox,new_todo.firstChild);
//     new_todo.appendChild(delete_todo_button);
//
//
//
//     // ol.innerHTML += ol.innerHTML + "<input class=\"choose\" type=\"checkbox\"> <li>" + msg_input.value+ "</li>";
//
//     todoNum++;
//     update();
//     return;
// };


