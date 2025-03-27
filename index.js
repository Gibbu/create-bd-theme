#!/usr/bin/env node

import { intro, outro, confirm, select, text, isCancel, cancel } from '@clack/prompts';
import K from 'kleur';
import fs from 'fs';
import path from 'path';
import ncp from 'ncp';
import { promisify } from 'util';
import { execa } from 'execa';
import { fileURLToPath } from 'url';

const access = promisify(fs.access);
const copy = promisify(ncp);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Replace any instance of the template to the given anwsers.
 * @param {string[]} filePath The path of the file newly cloned template.
 * @param {Object} answers The answers given.
 */
const setFields = (filePath, answers) => {
	try {
		let file = Buffer.from(fs.readFileSync(path.join(...filePath))).toString();
		file = file.replace(/--THEMENAME/g, answers.themeName);
		file = file.replace(/--DESCRIPTION/g, answers.themeDescription);
		file = file.replace(/--AUTHOR/g, answers.githubName);
		file = file.replace(/--VERSION/g, answers.themeVersion);

		fs.writeFileSync(path.join(...filePath), file);
	} catch (err) {
		console.log(`\n${chalk.red.bold('[ERROR]')}`, err);
		process.exit(1);
	}
};

/**
 * Finds an argument and returns it.
 * @param {string} arg The argument to be returned.
 * @returns {string} The argument.
 */
const getArg = (arg) => {
	return process.argv.find((e) => e.startsWith(`--${arg}`));
};

/**
 * @param {string} value
 * @retuns boolean
 */
const validateTextPrompt = (value) => {
	if (value.length === 0) return 'This field is required!';
};

const canCancel = (value) => {
	if (isCancel(value)) {
		cancel('Operation cancelled.');
		process.exit(0);
	}
};

const createProject = async () => {
	const folderName = process.argv[2];
	if (!folderName) {
		console.log(`\n${K.red().bold('[ERROR]')} You must provide a name for your new directory.\n` + '\t' + K.gray('npx create-bd-theme <directory name>') + '\n');
		process.exit(1);
	}

	let initGit = !!getArg('git');

	// Check if allowed access
	try {
		await access(path.resolve(__dirname, 'files'), fs.constants.R_OK);
		await access(path.resolve(__dirname, 'manager'), fs.constants.R_OK);
		await access(path.resolve(__dirname, 'shared'), fs.constants.R_OK);
	} catch (err) {
		console.error(K.red().bold(err));
		process.exit(1);
	}

	intro('create-bd-scss');

	const themeName = await text({
		message: 'What should we call your theme?',
		placeholder: folderName,
		defaultValue: folderName,
	});
	canCancel(themeName);

	const themeDescription = await text({
		message: 'Give your theme a description',
		validate: validateTextPrompt,
	});
	canCancel(themeDescription);

	const githubName = await text({
		message: 'What is your Github name?',
		placeholder: 'Make sure this is correct! This will be used for the GitHub pages remote link.',
		validate: validateTextPrompt,
	});
	canCancel(githubName);

	const themeVersion = await text({
		message: 'What is the initial version of your theme?',
		placeholder: '1.0.0',
		defaultValue: '1.0.0',
	});
	canCancel(themeVersion);

	const pkgManager = await select({
		message: 'Which package manager do you use?',
		options: [
			{ value: 'bun', label: 'Bun', hint: 'Bun is a newer runtime that is a replacement to NodeJS AND NPM (highly recommended).' },
			{ value: 'pnpm', label: 'PNPM', hint: 'PNPM is a faster alternative to NPM' },
			{ value: 'npm', label: 'NPM', hint: 'NPM is the default package manager that comes with NodeJS' },
		],
	});
	canCancel(pkgManager);

	if (!getArg('git')) {
		initGit = await confirm({
			message: 'Would you like to initialize a Git repository?',
		});
		canCancel(initGit);
	}

	// Copy files and set values.
	const destPath = path.join(process.cwd(), folderName);
	if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);

	try {
		await copy(path.resolve(__dirname, 'files'), destPath, { clobber: false });
		await copy(path.resolve(__dirname, 'shared'), destPath, { clobber: false });
		await copy(path.resolve(__dirname, 'manager', pkgManager), destPath, { clobber: false });
	} catch (err) {
		console.log(err);
		process.exit(1);
	}

	// Set bd-scss.config.json values
	setFields([destPath, 'bd-scss.config.js'], { themeName, themeDescription, themeVersion, githubName });

	// Set README.md values
	setFields([destPath, 'README.md'], { themeName, themeDescription, themeVersion, githubName });

	// Init Git
	if (initGit) {
		const result = await execa('git', ['init'], {
			cwd: path.join(process.cwd(), folderName),
		});
		if (result.failed) {
			console.log(`\n${K.red().bold('[ERROR]')} Failed to initialize Git.\n`);
			process.exit(1);
		}
	}

	outro('Your theme is ready!');

	console.log('Next steps:');
	console.log(`  1. ${K.yellow(`cd ${folderName}`)}`);
	console.log(`  2. ${K.yellow(`${pkgManager} install`)}`);
	console.log(`  3. ${K.yellow(`${pkgManager}${pkgManager === 'npm' ? ' run' : ''} dev`)}\n\n`);

	return true;
};

createProject();
