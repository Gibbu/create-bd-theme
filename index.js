#!/usr/bin/env node

import inq from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ncp from 'ncp';
import {promisify} from 'util';
import {execa} from 'execa';
import {fileURLToPath} from 'url';

const access = promisify(fs.access);
const copy = promisify(ncp);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const setFields = (filePath, answers) => {
	try {
		let file = Buffer.from(fs.readFileSync(path.join(...filePath))).toString()
		file = file.replace(/--THEMENAME/g, answers.theme_name);
		file = file.replace(/--DESCRIPTION/g, answers.theme_desc);
		file = file.replace(/--AUTHOR/g, answers.github_name);

		fs.writeFileSync(path.join(...filePath), file);
	} catch (err) {
		console.log(`\n${chalk.red.bold('[ERROR]')}`, err);
		process.exit(1);
	}
}

const getArg = (arg) => process.argv.find(e => e.startsWith(`--${arg}`));

const createProject = async() => {
	const folderName = process.argv[2];
	if (!folderName) {
		console.log(
			`\n${chalk.red.bold('[ERROR]')} You must provide a name for your new directory.\n`
			+ '\t'+chalk.gray('npx create-bd-theme <directory name>')+'\n'
		);
		process.exit(1);
	}

	const templateDir = path.resolve(__dirname, 'template');

	// Check if allowed access
	try {
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		console.error(chalk.red.bold(err));
		process.exit(1);
	}

	// Anwser questions about the theme
	let questions = [
		{
			type: 'input',
			name: 'theme_name',
			message: 'What do you want your Theme to be called?',
			default: folderName
		},
		{
			type: 'input',
			name: 'theme_desc',
			message: 'Give your theme a description:'
		},
		{
			type: 'input',
			name: 'github_name',
			message: 'What is your Github name?'
		}
	]

	// Ask to initialize git repo if arg not passed
	if (!getArg('git')) {
		questions = [...questions, {
			type: 'confirm',
			name: 'git_init',
			message: 'Would you like to initialize a Git repository?',
			default: false
		}]
	}

	const answers = await inq.prompt(questions);
	const initGit = !!getArg('git') || answers.git_init;

	// Copy files and set values.
	const destPath = path.join(process.cwd(), folderName);
	if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);

	try {
		await copy(`${__dirname}/template`, destPath, {
			clobber: false
		});
	} catch (err) {
		console.log(err);
		process.exit(1);
	}

	// Rename dist/THEMENAME.theme.css and set meta fields
	const newName = `${answers.theme_name}.theme.css`;
	fs.renameSync(path.join(destPath, 'dist', 'THEMENAME.theme.css'), path.join(destPath, 'dist', newName));
	setFields([destPath, 'dist', newName], answers);

	// Set meta fields in src/_theme.scss
	setFields([destPath, 'src', '_theme.scss'], answers);

	// Set package.json values
	setFields([destPath, 'package.json'], answers);

	// Set bd-scss.config.json values
	setFields([destPath, 'bd-scss.config.json'], answers);

	// Init Git
	if (initGit) {
		const result = await execa('git', ['init'], {
			cwd: path.join(process.cwd(), folderName),
		})
		if (result.failed) {
			console.log(`\n${chalk.red.bold('[ERROR]')} Failed to initialize Git.\n`);
			process.exit(1);
		}
	}

	console.log(
		`\n${chalk.greenBright.bold('[DONE]')} Your theme is ready!\n\n`
		+ `Next steps:\n`
		+ ` 1. ${chalk.yellowBright(`cd ${folderName}`)}\n`
		+ ` 2. ${chalk.yellowBright(`npm install`)}\n`
		+ ` 3. ${chalk.yellowBright(`npm run dev`)}\n`
	);
	return true;
}

createProject();