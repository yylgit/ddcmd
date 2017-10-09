
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var express = require('express');
var opn = require('opn');
exports.name = 'pagelist';
exports.usage = '[options]';
exports.desc = 'show pagelist of the project';


//准备参数
var pagePrefix = 'http://localhost:8080/';
var templatePrefix = 'http://localhost:8080/smarty/';
var pathList = [];
var templateList = [];
var result = '';
var servicePort = 8090;

exports.register = function (commander) {
    commander
    .option('-r, --root [root]','项目根目录,可选项，默认当前命令执行目录')
    .option('-s, --serviceport [serviceport]','本服务启用的端口号')
    .option('-p, --port [port]','项目所在服务的端口号')
    .action(function () {
      //传给action中函数的参数最后一个是options的对象，其他的是命令的参数
      var args = Array.prototype.slice.call(arguments)
      var options = args.pop();

      servicePort = options.serviceport || servicePort;
      
      if(options && options.port) {
        pagePrefix = pagePrefix.replace('8080',options.port);
        templatePrefix = templatePrefix.replace('8080',options.port);
      }

      var root = process.cwd();
      if(options && options.root) {
        root = path.resolve(options.root)
      }

      pagePath = path.join(root, 'page');
      templatePath = path.join(root, 'template');
      
      generatePage();
      getTemplate();
      
      result = getResult();

      openServer();

    }) // action end
}


function generatePage() {
  var  pageExists = fs.existsSync(pagePath)
  if(!pageExists) {
    console.log('不存在该page路径:'+ pagePath)
  } else {
    //遍历页面生成页面链接
    var pageFiles = fs.readdirSync(pagePath);
    pageFiles.forEach(function (file){
      if(/^\..*/.test(file)) return;
      var stat = fs.lstatSync(path.join(pagePath, file))
      if(stat.isDirectory()) {
        pathList.push(pagePrefix + file + '/')
      }
    })
  }
}

function getTemplate() {
  var  templateExists = fs.existsSync(templatePath)
  if(!templateExists) {
    console.log('不存在该template路径:'+ templatePath)
  } else {
    //遍历模板生成页面链接
    var templateFiles = fs.readdirSync(templatePath);
    templateFiles.forEach(function (file){
      if(/^\..*/.test(file)) return;
      var stat = fs.lstatSync(path.join(templatePath, file))
      if(stat.isDirectory()) {
        templateList.push(templatePrefix + file + '/')
      }
    })
  }
}

function getResult() {
  var rawTemplate = fs.readFileSync(path.join(__dirname,'./pagelist.hbs'),'utf8');
  var compileTemplate = handlebars.compile(rawTemplate);
  return compileTemplate({
    pageList: pathList.concat(templateList)
  });

}

function openServer() {
  var app = express();

  //静态资源服务，如果有匹配的资源，则直接return，没有执行后面的代码
  app.use(express.static(__dirname, {
    maxAge: 0//指定浏览器缓存时间，默认带着etag和lastmodify
    //请求时带着if modify-since 和 if none match
  }))
  app.use(function(req, res) {
    res.end(result)
  })
  app.listen(servicePort, function () {
    console.log('已经启动服务：http://localhost:'+servicePort)
    opn('http://localhost:'+servicePort);
  });
}