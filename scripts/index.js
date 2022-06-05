const puppeteer = require('puppeteer');
const fs = require('fs');
const store = require('../scripts/store.js')
const get_q = require("../scripts/getqueations");
require('date-utils');

const main = document.getElementById('main');
const add_bt = document.getElementById('add');  
const send_bt = document.getElementById('make');

const name = store.get('name');
const id = store.get('id');
const save_directory = store.get('save_path');

let q_amount=1;

(async ()=>{
    add_bt.addEventListener('click',()=>{
        q_amount++;
        let div = document.createElement('div');
        let div1 = document.createElement('div');
        div1.innerText+="問題番合";
        div.appendChild(div1);
        div.className="q_form";
        let q_in = document.createElement('input');
        q_in.type="text";
        q_in.className="q_number";
        q_in.id="q_"+q_amount;
        div.appendChild(q_in);
        div1 = document.createElement('div');
        div1.innerText+="ソースファイル（同名のテキストファイルに実行結果を書き込んでおくとそれも自動で取得できます。）";
        div.appendChild(div1);
        let f_in = document.createElement('input');
        f_in.type="file";
        f_in.multiple = true;
        f_in.className="sorce";
        f_in.id="f_"+q_amount;
        div.appendChild(f_in);
        main.appendChild(div);
    });
    send_bt.addEventListener('click',async ()=>{
        let qnumbers = await getqnumbers();
        let report_num = document.getElementById('report_number').value;
        let files_eles = document.getElementsByClassName('sorce');
        let title = "AF21022-SoftC-"+await titlemake(report_num,qnumbers)+".txt";
        const dt = new Date().toFormat("MM月DD日");
        let text = "情報通信基礎実験Cソフトウェア実習レポート("+await textmake(report_num,qnumbers)+")("+dt+")\n";
        text += "\n" + id + " " + name + "\n\n";
        let q = await get_q(report_num);
        for(let i in qnumbers){
            text += "["+report_num+"-"+qnumbers[i]+"]\n";
            text += q[qnumbers[i]-1];
            text += "\n[解答]\n"
            if (files_eles[i]){
                for(let item of files_eles[i].files) {
                    text += "次に" + item.name + "を示す。\n"
                    text += "===ここから" + item.name + "===\n"
                    text += fs.readFileSync(item.path, 'utf8');
                    text += "\n===ここまで" + item.name + "===\n"
                    if(item.name.match(/.*\.c/)) {
                        text += "===ここから" + item.name + "の実行結果===\n"
                        path = item.path;
                        path = path.slice(0, -2) + ".txt";
                        text+=fs.readFileSync(path,'utf8');
                        text += "\n===ここまで" + item.name + "の実行結果===\n\n"
                    }
                }
            }
        }
        text+="----------------------------\n";
        text+=id+" "+name;
        fs.writeFileSync(save_directory+title,text);
        browser.close();
    });
})();

async function getqnumbers(){
    let res = [];
    let eles = document.getElementsByClassName('q_number');
    for(let ele of eles){
        res.push(ele.value);
    }
    return res;
}

async function titlemake(rp_name,q_names){
    let res = rp_name + "-";
    for(let q of q_names){
        res +=   q + "-";
    }
    res = res.slice(0,-1);

    return res;
}

async function textmake(rp_name,q_names){
    let res = "";
    for(let q of q_names){
        res += rp_name + "-" + q + ",";
    }
    res = res.slice(0,-1);

    return res;
}