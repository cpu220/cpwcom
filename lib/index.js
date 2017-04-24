/*
 * 通用方法合集
 */

const fs = require('fs');
const common = function() {

}


// 文件处理
common.proptype.file = {
    set: function(file, message, opation) {
        fs.appendFile(file, message, (err) => {
            if (err) {
                throw err;
            }

        });
    },
    reset: function(file, message, callback) {
        fs.writeFile(file, message, (err) => {
            if (err) {
                throw err;
            }
            if (!!callback) {
                callback();
            }
        });
    },
    read: function(file, callback) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            if (callback) {
                callback(data);
            }
        });
    },
    readdir: function(path, callback) {
        fs.readdir(path, (err, fd) => {
            if (err) {
                throw err;
            }
            if (callback) {
                callback(fd);
            }
        });
    },
    readdirSync: function(path, callback) {
        var file = fs.readdirSync(path);
        if (callback) {
            callback(file);
        }
    },
    // 获取指定目录下指定文件合集
    searchFileType: function(root, fileType, callback) {
        this.array = [];
        this.getFile(root, fileType, callback);
    },
    // 获取指定目录下指定文件合集（内部调用方法）
    getFile: function(root, fileType, callback) {
        const _this = this;


        _this.readdirSync(root, (file) => {
            file.forEach((file) => {
                if (file.indexOf('.' + fileType) > 0) {
                    _this.array.push(file);
                } else if (file.indexOf('.') < 0) {
                    // 目录
                    _this.getFile(root + '/' + file, fileType, (file) => {
                        _this.array.concat(file);
                    });
                }
            });

        });

        callback(_this.array);

    },
    open: function(file, callback) {
        fs.open(file, 0666, (err, d) => {
            if (err) {
                throw err
            }

            if (callback) {
                callback(d);
            }
        });
    },
    create: function(file, message, callback) {
        const _this = this;
        const array = file.split('/');
        const name = array[array.length - 1];
        if (name.indexOf('.') < 0) {
            console.error('当前目录地址格式错误');
            return false;
        }

        var root = file.substring(0, file.indexOf(name));

        common.exists({
            path: file,
            callback: function(data) {
                if (data) {
                    console.error(file + '对应目录文件已存在,创建失败');
                } else {
                    common.mkdirSync(root, () => {
                        _this.resest(file, message, callback);
                    });
                }
            }
        });
    },
    mkdirSync: function(root, callback) {
        fs.mkdir(root, 0777, (err) => {
            if (err) {
                console.error(root + ' =>对应目录已存在');
            } else {
                console.tip(root + '=> 目录已创建完成');
            }
            if (callback) {
                callback();
            }
        });
    },
    // 判断文件是否存在
    exists: function(obj) {
        fs.exists(obj.path, (exists) => {
            if (!exists) {
                if (obj.error) {
                    obj.error(exists);
                }
            } else {
                if (obj.success) {
                    obj.success(exists);
                }
            }
            if (obj.callback) {
                obj.callback(exists);
            }
        });
    },
    // 读取文件
    readFile: function(obj) {
        fs.readFile(obj.path, obj.encode || 'utf8', (err, file) => {
            obj.callback(err, file);
        });
    },

};

// json 处理
common.proptype.JSON = {
    get: function() {
        return JSON.parse(fs.readFileSync(file));
    }
};

// 工具类
common.proptype.tools = {
    formatDate: function(date) {
        const arr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        const D = date.getDate(),
            M = date.getMonth() + 1,
            Y = date.getFullYear(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        return Y + '-' + (arr[M] || M) + '-' + (arr[D] || D) + '-' + (arr[h] || h) + ':' + (arr[m] || m) + ':' + (arr[s] || s);
    },
    formatData: function(obj, type) {
        const _this = this,
            data = decodeURI(obj.toString());
        if (type === 'json') {
            data = _this.dataToObj(data);
        }
        return data;
    },
    dataToObj: function(url) {
        var obj = {};
        var keyvalue = [];
        var key = '',
            value = '';

        var paraString = url.substring(0, url.length).split('&');
        for (var i in paraString) {
            keyvalue = paraString[i].split('=');
            key = keyvalue[0];
            value = keyvalue[1];
            obj[key] = value;
        }
        return JSON.stringify(obj);
    }
};

const cpwcom = new common();
module.exports = cpwcom;
