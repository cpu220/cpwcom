const fs = require('fs');
// const path = require('path');

class createFile {
    constructor(root, suffix) {
        this.root = root;
        this.arr = [];
        this.suffix = suffix;
    }

    create(dir,message) {
        const _this=this;
        var array = dir.split('/');

        var dirArray = [];
        for (let _dir of array) {
          dirArray.push(`${dirArray[dirArray.length-1||0]||''}${_dir}/`);
        }
        // dirArray.pop();
        this.createDir(dirArray).then(()=>{
          _this._createFile(dir,message).then(console.log('end'));
        });
    }
    createDir(array){
      const _this=this;
      return new Promise((resolve,reject)=>{
        _this._createDir(array,0,(file)=>{
          resolve(file);
        });
      })
    }
    _createDir(array,index,callback){
      const _this= this;
      if(index < array.length-1){
        // 下标小于length说明还在递归目录
        fs.mkdir(array[index],0o777, function(){
          console.log(`${array[index]}创建完毕`)
          index+=1;
          _this._createDir(array,index,callback);

        })
      }else {
        // 最后一个
        callback(array[index])
      }
    }
    _createFile(file,message){
      return new Promise((resolve,reject)=>{
        fs.writeFile(file, message, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
      });
    }
}

const A = new createFile();
const a = 'aa/bb/cc/ff.json';
A.create(a,'123');

// module.exports = getFile;
