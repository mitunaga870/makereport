const puppeteer = require('puppeteer');
const fs = require('fs');
require('date-utils');
const main = document.getElementById('main');
const add_bt = document.getElementById('add');
const send_bt = document.getElementById('make');

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
        let text = "情報通信基礎実験Cソフトウェア実習レポート("+await textmake(report_num,qnumbers)+")("+dt+")\n\n";
        console.log(title+"\n"+text);
        let browser = await puppeteer.launch({headless:true});
        let page = await browser.newPage();
        await page.goto('http://web.kanz.ice.shibaura-it.ac.jp/softC/report/report'+report_num+'.html');
        let q = await page.$$eval("ol", (list) => {
            let li = list[0].getElementsByTagName('li');
            let res = [];
            for (let text of li){
                if (!text.parentNode.parentNode.tagName.match('LI'))
                    res.push(text.textContent);
            }
            return res;
        })
        for(let i in qnumbers){
            text += "["+report_num+qnumbers[i]+"]\n\n";
            text += q[qnumbers[i]-1];
            text += "\n[解答]\n"
            if (files_eles[i]){
                for(let item of files_eles[i].files)
                    text += "次に"+item.name+"を示す。n"
                    text += fs.readFileSync(item.path,'utf8')
            }
        }
    })
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