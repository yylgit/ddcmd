#! /usr/bin/env node

var path = require('path');
var commander = require('commander');
var package = require('./package.json');
var argv = process.argv;
/** 
 * dd -h
 * [ '/Users/didi/.nvm/versions/node/v7.9.0/bin/node',
  '/Users/didi/.nvm/versions/node/v7.9.0/bin/dd',
  '-h' ]
 * */ 
var first = argv[2];
if(argv.length < 3 || first === '-h' ||  first === '--help'){
    help();
} else if(first === '-v' || first === '--version'){
    version();
} else if(first[0] === '-'){
    help();
} else {
    var cmd = require(path.join(__dirname, './commanders', first));
    cmd.register(
        commander
            .command(cmd.name || first)
            .usage(cmd.usage)
            .description(cmd.desc)
    );
    commander.parse(argv); 
}

function help() {
    var content = [
        '',
        '  Usage: dd <command>',
        '',
        '  Commands:',
        '',
        '     pagelist    generate the pagelist of ididi'
    ];
    console.log(content.join('\n'));
}

function version() {
    var content = [
        '       D D D D D D D              D D D D D D D',
        '       D D D D D D D D            D D D D D D D D',
        '       D D           D D          D D           D D',
        '       D D             D D        D D             D D',
        '       D D              D D       D D              D D',
        '       D D               D D      D D               D D',
        '       D D                D D     D D                D D',
        '       D D                 D D    D D                 D D',
        '       D D                 D D    D D                 D D',
        '       D D                 D D    D D                 D D',
        '       D D                D D     D D                D D',
        '       D D               D D      D D               D D',
        '       D D              D D       D D              D D',
        '       D D            D D         D D            D D',
        '       D D           D D          D D           D D',
        '       D D D D D D D D            D D D D D D D D',
        '       D D D D D D D              D D D D D D D',
        '                                                ',
        '       '+package.version+'                    '
    ]

    console.log(content.join('\n'))

}


