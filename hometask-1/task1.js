process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (str) {
    process.stdout.write(str.replace(/(\r\n|\n|\r)/gm, "").split("").reverse().join("") + '\n' + '\n');
});
