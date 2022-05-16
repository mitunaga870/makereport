const scan  = require('./scan');
require('date-utils');
const puppeteer = require('puppeteer');
const fs = require('fs');
const number = "AF21022";//個人でーた入力
const name = "光永和生";//名前入力
const sorce_current = "C:\\deta\\CLion\\tempcode\\";
const save_current = "C:\\Users\\makin\\Desktop\\";

(async ()=>{
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
    await page.goto('http://web.kanz.ice.shibaura-it.ac.jp/softC/report/report'+qnumber[0].split(/-/)[0]+'.html');
    let q = await page.$$eval("ol", (list) => {
        let li = list[0].getElementsByTagName('li');
        let res = [];
        for (let text of li){
            if (!text.parentNode.parentNode.tagName.match('LI'))
                res.push(text.textContent);
        }
        return res;
    });
    const dt = new Date().toFormat("MM月DD日");
    let filename = "AF21022-SoftC-"+await getfilename(qnumber)+".txt";
    let text = "情報通信基礎実験Cソフトウェア実習レポート("+await textmake(qnumber)+")("+dt+")\n\n";
    text += number+" " +name+"\n\n"
    for (let question of qnumber){
        text += "[" + question + "]\n";
        text += q[parseInt(question.split(/-/)[1])-1];
        text+="\n[解答]\n";
        console.log("ファイル名を入力してください。(ない場合は空文字入力)");
        while (true){
            const file = await scan();
            if(!file){
                text+="\n";
                break;
            }
            text+="次に"+file+"を示す。\n"
            text+="===ここから"+file+"===\n";
            text+=fs.readFileSync(sorce_current+file,'utf8');
            text+="\n===ここまで"+file+"===\n";
            if(file.match(/.*\.c/)){
                text+="\n次に"+file+"の実行結果を示す。\n";
                text+="===ここから"+file+"の実行結果===\n";
                let resfile = file.slice(0,-2)+".txt";
                text+=fs.readFileSync(sorce_current+resfile,'utf8');
                text+="\n===ここまで"+file+"の実行結果===\n";
            }
        }
    }
    text+="\n----------------------------\n";
    text+=number+"　"+name;
    fs.writeFileSync(save_current+filename,text);
    browser.close();
    return;
})();
async function textmake(args){
    let res = "";
    for(let item of args){
        res += item + ",";
    }
    res=res.slice(0,-1);
    return res;
}
async function getfilename(args){
    let res = args[0].split(/-/g)[0]+"-";
    for(let i of args){
        res += i.split(/-/g)[1]+"-";
    }
    res = res.slice(0,-1);
    return res;
}