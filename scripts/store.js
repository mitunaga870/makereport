const Store = require('electron-store');
const schema = {
    id: {
        type: 'string',
        default: ""
    },
    name:{
        type: 'string',
        default: ""
    },
    save_path:{
        type: 'string',
        default: ""
    }
};
module.exports = new Store({schema});
