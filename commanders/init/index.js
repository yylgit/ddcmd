
var fs = require('fs');
var path = require('path');

exports.name = 'init';
exports.usage = '[options]';
exports.desc = 'init some template for project';

exports.register = function ( commander ) {
   commander
    .option('-r, --root [root]','项目根目录,可选项，默认当前命令执行目录')
    .action(function () {
      var args = Array.prototype.slice(arguments);
      var options  = args.pop();

      var root = process.cwd();
      if(options && options.root) {
        root = path.resolve(options.root)
      }
      var pagePath = path.join(root, 'page');
      var templatePath = path.join(root, 'template');
      var  cmd = process.argv[3];
      //页面信息的对象
      //title
      var pageInfo = {};
      if(cmd == 'pageinfo') {
        var  pageExists = fs.existsSync(pagePath)
        if(!pageExists) {
          console.log('不存在该page路径:'+ pagePath)
        } else {
          
          var pageFiles = fs.readdirSync(pagePath);
          pageFiles.forEach(function (file){
            if(/^\..*/.test(file)) return;
            var stat = fs.lstatSync(path.join(pagePath, file))
            if(stat.isDirectory()) {
              var key = '/'+file+'/'
              pageInfo[key] = {
                title: '',
                wiki: '',
                jira: '',
                person: '',
                onlineUrl: '',
                remark: '',
              };
              var htmlpath = path.join(pagePath, file,'main.html')
              console.log(path.join(pagePath, file,'main.html'))
              var  htmlExists = fs.existsSync(htmlpath);
              if(htmlExists) {
                var fileText = fs.readFileSync(htmlpath,{encoding: 'utf8'});
                var reg = /<title>(.*)<\/title>/
                var result = fileText.match(reg)
                if(result && result.length > 1) {
                  pageInfo[key].title = result[1]
                }
              }
            }
          })

        }

        var  templateExists = fs.existsSync(templatePath)
        if(templateExists) {

          var templateFiles = fs.readdirSync(templatePath);
          templateFiles.forEach(function (file){
            if(/^\..*/.test(file)) return;
            var stat = fs.lstatSync(path.join(templatePath, file))
            if(stat.isDirectory()) {
              var key = '/smarty/'+file+'/'
              pageInfo[key] = {
                title: '',
                wiki: '',
                jira: '',
                person: '',
                onlineUrl: '',
                remark: '',
              };
              var htmlpath = path.join(templatePath, file,'main.tpl')
              var  htmlExists = fs.existsSync(htmlpath);
              if(htmlExists) {
                var fileText = fs.readFileSync(htmlpath,{encoding: 'utf8'});
                var reg = /<title>(.*)<\/title>/
                var result = fileText.match(reg)
                if(result && result.length > 1) {
                  pageInfo[key].title = result[1]
                }
              }
            }
          })
        }

        var oldFilePath = path.join(root, 'pageInfo.json')
        var oldJson;
        if(fs.existsSync(oldFilePath)) {
          try {
            oldJson = fs.readFileSync(oldFilePath, {encoding: 'utf8'})
            oldJson = JSON.parse(oldJson)
          }
          catch(e) {
            console.log('获取项目pageInfo.json文件错误')
            console.log(e)
          }
        } 

        if(oldJson) {
          pageInfo = Object.assign({}, pageInfo, oldJson);
        }

        fs.writeFileSync('pageInfo.json',JSON.stringify(pageInfo, '', 4),{encoding: 'utf8'})
      }

    })

}