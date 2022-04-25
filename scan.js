module.exports = function scan(counter) {
    return new Promise((resolve)=> {
        process.stdin.resume();
        process.stdin.setEncoding("utf8");

        if (counter==undefined){//カウンターが未定義のとき（１データ）
            single()
                .then((data)=>{
                    resolve(data);
                })
        }else {
            malti(counter)
                .then((data)=>{
                    resolve(data);
                })
        }
    });
}
function single(){
    return new Promise((resolve)=> {
        var str = "";
        var reader = require("readline").createInterface({
            input: process.stdin,
        });
        reader.on("line", (input) => {
            str = input;
            reader.close();
        })
        reader.on("close", () => {
            resolve(str);
        })
    });
}

function malti(conter){
    return new Promise((resolve)=> {
        var str = [];
        var reader = require("readline").createInterface({
            input: process.stdin,
        });
        reader.on("line", (input) => {
            conter--;
            if(conter<=0)
                reader.close();
            str.push(input);
        })
        reader.on("close", () => {
            resolve(str);
        })
    });
}