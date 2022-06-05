const store = require('../scripts/store.js');

const name_box = document.getElementById('name');
const id_box = document.getElementById('id');
const savepath_box = document.getElementById('save_path');
const send_bt = document.getElementById('send');

const name = store.get('name');
const id = store.get('id');
const save_directory = store.get('save_path');

(async ()=>{
    console.log("送信");
    name_box.value = name;
    id_box.value = id;
    savepath_box.value = save_directory;
    send_bt.addEventListener('click',async ()=>{
        await store.set('name',name_box.value);
        await store.set('id',id_box.value);
        await store.set('save_path',savepath_box.value);
    })
})();