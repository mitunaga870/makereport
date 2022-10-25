const scan  = require('./scan');
require('date-utils');
const puppeteer = require('puppeteer');
const fs = require('fs');
const number = "AF21022";//学番入力
const name = "光永和樹";//名前入力

(async ()=>{
    console.log(
        "科目名を選択してください\n"+
        "info1:0\n" +
        "softD:1");
    let tmp,sub=undefined,subtxt;
    do{
        tmp = await scan();
        switch (parseInt(tmp)){
            case 0:
                sub = "info1";
                subtxt = "情報処理基礎１";
                break;
            case 1:
                sub = "softD";
                subtxt = "情報通信基礎実験Dソフトウェア"
                break;
        }
    }while (sub==undefined);
    console.log("今回のレポート番号を入力してください");
    let reportnum = await scan();
    console.log("今回の課題問題番号を入力してください");
    let qnumber = [];
    while (true){
        let temp = await scan();
        if (!temp)
            break;
        qnumber.push(temp);
    }
    if(qnumber.length==0)
        return;
    let browser = await puppeteer.launch({headless:true});
    let page = await browser.newPage();
    let q;
    try {
        await page.goto('http://web3.kanz.ice.shibaura-it.ac.jp/' + sub + '/report/report' + reportnum + '.html');
        q = await page.$$eval("ol", (list) => {
            let li = list[0].getElementsByTagName('li');
            let res = [];
            for (let text of li){
                if (!text.parentNode.parentNode.tagName.match('LI'))
                    res.push(text.textContent);
            }
            return res;
        });
    }catch (e) {
        console.log("問題文を取得できませんでした。vpnが無効になっている可能性があります");
        q=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
    }
    const dt = new Date().toFormat("MM月DD日");
    let filename = "AF21022-"+sub+"-"+reportnum+"-"+await getfilename(qnumber)+".txt";
    let text = subtxt+"レポート("+await textmake(reportnum,qnumber)+")("+dt+")\n\n";
    text += number+" " +name+"\n\n"
    for (let question of qnumber){
        text += "[" + question + "]\n";
        text += q[parseInt(qnumber)-1];
        text+="\n[解答]\n";
        console.log("ファイル名を入力してください。(ない場合は空文字入力)");
        const file = await scan();
        if(!file){
            text+="\n";
            continue;
        }
        const file_txt = await getfiletxt(file);
        text+="次に"+file_txt+"を示す。\n"
        text+="===ここから"+file_txt+"===\n";
        text+=fs.readFileSync("/home/comm/"+sub+"/"+file,'utf8');
        text+="\n===ここまで"+file_txt+"===\n";
        if(file.match(/.*\.c/)){
            text+="\n次に"+file_txt+"の実行結果を示す。\n"
            text+="===ここから"+file_txt+"の実行結果===\n";
            text+="\n===ここまで"+file_txt+"の実行結果===\n";
        }
    }
    text+="\n----------------------------\n";
    text+=number+"　"+name;
    fs.writeFileSync(filename,text);
    browser.close();
    return;
})();
async function textmake(reportnum,args){
    let res = "";
    for(let item of args){
        res += reportnum+"-"+item + ",";
    }
    res=res.slice(0,-1);
    return res;
}
async function getfilename(args){
    let res = "";
    for(let i of args){
        res += i+"-";
    }
    res = res.slice(0,-1);
    return res;
}
async function getfiletxt(base){
    let args = base.split(/\//g);
    return args[args.length-1];
}