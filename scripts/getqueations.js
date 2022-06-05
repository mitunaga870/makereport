const puppeteer = require('puppeteer');
const {ipcRenderer} = require("electron");

module.exports = async (report_num) => {
    let q = "";
    try {
        let browser = await puppeteer.launch({headless: true, args: ['--incognito', '--disable-extensions']});
        const page = (await browser.pages())[0];
        await page.goto('http://web.kanz.ice.shibaura-it.ac.jp/softC/report/report' + report_num + '.html');
        let q = await page.$$eval("ol", (list) => {
            let li = list[0].getElementsByTagName('li');
            let res = [];
            for (let text of li) {
                if (!text.parentNode.parentNode.tagName.match('LI'))
                    res.push(text.textContent);
            }
            return res;
        })
        browser.close();
    }catch (e) {
        await ipcRenderer.invoke('notice',["問題文の取得に失敗しました。\n手動でコピペしてください"]);
    }
    return q;
}