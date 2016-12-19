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
console.log(hobgoblinDir);

program
	.version('1.0.0')
	.command('init')
	.description('Initialize framework in current directory')
	.option('-e, --examples', 'Pull in all example files')
	.action(function(options) {
		let contents = fs.readdirSync(srcDir);
		let curDir = fs.readdirSync('./');
		for (var i = 0; i < contents.length; i++) {
			if(curDir.indexOf(contents[i]) > -1) {
				console.log(contents[i] + ' already exists. Skipping...');
			} else {
				let filePath = srcDir + contents[i];
				let readStream = fs.createReadStream(filePath);
				let newFile = fs.createWriteStream(contents[i]);
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
		}
	});

program.parse(process.argv);