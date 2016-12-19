#!/usr/bin/env node
'use strict';

// https://medium.freecodecamp.com/writing-command-line-applications-in-nodejs-2cf8327eee2#.196im2niz
// https://www.npmjs.com/package/commander
// https://developer.atlassian.com/blog/2015/11/scripting-with-node/

const program = require('commander'),
	  fs = require('fs'),
	  p = require('path');

var hobgoblinDir = p.dirname(require.main.filename);
var srcDir = hobgoblinDir + '/src/';
var exampleDir = hobgoblinDir + '/examples/';

program
	.version('1.0.0')
	.command('init')
	.description('Initialize framework in current directory')
	.option('-e, --examples', 'Pull in all example files')
	.action(function(options) {
		// Copy over the main files
		let contents = fs.readdirSync(srcDir);
		let curDir = fs.readdirSync('./');
		let jsFiles;
		for (var i = 0; i < contents.length; i++) {
			if(curDir.indexOf(contents[i]) > -1) {
				console.log(contents[i] + ' already exists. Skipping...');
			} else {
				let filePath = srcDir + contents[i];
				let readStream = fs.createReadStream(filePath);
				let newFile = fs.createWriteStream(contents[i]);
				console.log('Writing file ' + contents[i] + '...');
				readStream.on('data', (chunk) => {
					newFile.write(chunk);
				});
				readStream.on('end', () => {
					console.log('done');
					newFile.end();
				});
				readStream.on('error', (err) => {
					newFile.end();
					console.error(err);
				});
			}
		}

		jsFiles = contents.slice();

		// Copy examples, if specified
		if(options.examples) {
			let exampleFiles = fs.readdirSync(exampleDir);
			for (var i = 0; i < exampleFiles.length; i++) {
				if(curDir.indexOf(exampleFiles[i]) > -1) {
					console.log(exampleFiles[i] + ' already exists. Skipping...');
				} else {
					let filePath = exampleDir + exampleFiles[i];
					let readStream = fs.createReadStream(filePath);
					let newFile = fs.createWriteStream('example-' + exampleFiles[i]);
					console.log('Writing file ' + exampleFiles[i] + '...');
					readStream.on('data', (chunk) => {
						newFile.write(chunk);
					});
					readStream.on('end', () => {
						console.log('done');
						newFile.end();
					});
					readStream.on('error', (err) => {
						newFile.end();
						console.error(err);
					});
				}
			}
			jsFiles.concat(exampleFiles);
		}

		if(fs.existsSync('index.html'))
			console.log("index.html already exists. Skipping...");
		else
			fs.writeFile('index.html', generateIndexHTML(jsFiles), (err) => {
				if(err) console.error(err);
				else console.log("done!");
			});
	});

function generateIndexHTML(jsFiles) {
	var html = '<!DOCTYPE html>\n';
		html += '<html lang="en">\n';
		html += '<head>\n';
		html += '  <meta charset="UTF-8">\n';
		html += '  <title>[Your Game] - A Roguelike</title>\n';
		html += '  <link rel="stylesheet" href="css/style.css">\n';
		for (var i = 0; i < jsFiles.length; i++) {
			html += '<script src="' + jsFiles[i] + '" type="text/javascript"></script>\n';
		}
		html += '</head>\n';
		html += '<body></body>\n';
		html += '</html>';

	return html;
}

program.parse(process.argv);