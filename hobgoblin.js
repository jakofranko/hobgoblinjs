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
		// If the js dir doesn't exist, create it
		if(!fs.existsSync('js/'))
			fs.mkdir('js');

		// Copy over the main files
		let contents = fs.readdirSync(srcDir);
		let jsDir = fs.readdirSync('js');
		let jsFiles;
		for (var i = 0; i < contents.length; i++) {
			if(jsDir.indexOf(contents[i]) > -1) {
				console.log(contents[i] + ' already exists. Skipping...');
			} else {
				let filePath = srcDir + contents[i];
				let readStream = fs.createReadStream(filePath);
				let newFile = fs.createWriteStream('js/' + contents[i]);
				console.log('Writing file ' + contents[i] + '...');
				readStream.on('data', (chunk) => {
					newFile.write(chunk);
				});
				readStream.on('end', () => {
					newFile.end();
				});
				readStream.on('error', (err) => {
					newFile.end();
					console.error(err);
				});
			}
		}

		// Copy examples, if specified
		if(options.examples) {
			let examples = fs.readdirSync(exampleDir);
			let exampleFiles = examples.map((file) => {
				return 'example-' + file;
			});
			for (var i = 0; i < exampleFiles.length; i++) {
				if(jsDir.indexOf(exampleFiles[i]) > -1) {
					console.log(exampleFiles[i] + ' already exists. Skipping...');
				} else {
					let filePath = exampleDir + examples[i]; // read from unmodified file name
					let readStream = fs.createReadStream(filePath);
					let newFile = fs.createWriteStream('js/' + exampleFiles[i]);
					console.log('Writing file ' + exampleFiles[i] + '...');
					readStream.on('data', (chunk) => {
						newFile.write(chunk);
					});
					readStream.on('end', () => {
						newFile.end();
					});
					readStream.on('error', (err) => {
						newFile.end();
						console.error(err);
					});
				}
			}
			jsFiles = contents.concat(exampleFiles);
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
		html += '\t<meta charset="UTF-8">\n';
		html += '\t<title>[Your Game] - A Roguelike</title>\n';
		html += '\t<link rel="stylesheet" href="css/style.css">\n';
		for (var i = 0; i < jsFiles.length; i++) {
			html += '\t<script src="js/' + jsFiles[i] + '" type="text/javascript"></script>\n';
		}
		html += '</head>\n';
		html += '<body></body>\n';
		html += '</html>';

	return html;
}

program.parse(process.argv);