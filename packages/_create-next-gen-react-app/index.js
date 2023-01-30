#!/usr/bin/env node

// Usage: npx create-next-gen-react-app@latest

import fs from "node:fs";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

import inquirer from "inquirer";
import chalk from "chalk";
import validate from "validate-npm-package-name";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];
if (major < 16) {
	console.error(
		`${chalk.red(`You are running Node ${currentNodeVersion}.\n`)}` +
			`${chalk.underline("create-next-gen-react-app")} requires Node 16 or higher.\n` +
			"Please update your version of Node.",
	);
	process.exit(1);
}

let projectName;
let package_manager;
let init_git_repo;
let bundler;

await inquirer
	.prompt([
		{
			type: "input",
			name: "project_name",
			message: "Project name:",
			default: "react-app-next-gen",
			validate: async (answer) => {
				if (answer === "\\" || answer === "") {
					return chalk.red(
						`Project name can't be ${chalk.underline("empty")} or ${chalk.underline(
							"\\",
						)}.`,
					);
				}

				const pnv = validate(answer);
				if (!pnv.validForNewPackages) {
					let validation_errors = "";
					if (pnv?.errors) {
						for (const error of pnv.errors) {
							validation_errors += error;
						}
					}
					if (pnv?.warnings) {
						for (const warning of pnv.warnings) {
							validation_errors += warning;
						}
					}
					return validation_errors;
				}

				if (fs.existsSync(answer)) {
					return chalk.red(`Directory with that name already exists.`);
				}

				return true;
			},
		},

		{
			type: "list",
			name: "package_manager",
			message: "Package manager:",
			choices: ["npm", "pnpm"],
		},

		{
			type: "list",
			name: "bundler",
			message: "Bundler:",
			choices: ["vite", "webpack", "experimental"],
		},

		{
			type: "confirm",
			name: "init_git",
			message: "Initialize repo with git:",
		},
	])
	.then((answer) => {
		projectName = answer.project_name;
		package_manager = answer.package_manager;
		bundler = answer.bundler;
		init_git_repo = answer.init_git;
	})
	.catch((error) => {
		if (error.isTtyError) {
			console.log(chalk.red(`Prompt couldn't be rendered in the current environment`));
		} else {
			console.log(chalk.red(`Error failed to get answer - `, error));
		}

		process.exit(1);
	});

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

if (bundler === "webpack") {
	const templateDir = path.resolve(
		__dirname,
		"../create-next-gen-react-app-template-webpack",
	);
	fs.cpSync(templateDir, projectDir, { recursive: true });
} else if (bundler === "vite") {
	const templateDir = path.resolve(__dirname, "../create-next-gen-react-app-template-vite");
	fs.cpSync(templateDir, projectDir, { recursive: true });
} else if (bundler === "experimental") {
	const templateDir = path.resolve(
		__dirname,
		"../create-next-gen-react-app-template-experimental",
	);
	fs.cpSync(templateDir, projectDir, { recursive: true });
}

fs.renameSync(path.join(projectDir, "gitignore"), path.join(projectDir, ".gitignore"));
fs.renameSync(path.join(projectDir, "env"), path.join(projectDir, ".env"));
fs.renameSync(path.join(projectDir, "eslintrc.cjs"), path.join(projectDir, ".eslintrc.cjs"));

const projectPackageJson = require(path.join(projectDir, "package.json"));
projectPackageJson.name = projectName;

fs.writeFileSync(
	path.join(projectDir, "package.json"),
	JSON.stringify(projectPackageJson, null, 2),
);

let cmd;
if (package_manager === "npm") {
	cmd = "npm install";
} else if (package_manager === "pnpm") {
	cmd = "pnpm install";
}

console.log("Installing packages, please wait this might take a few minutes.");

exec(
	cmd,
	{
		cwd: projectDir,
	},
	(err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(stdout);
	},
);

if (init_git_repo) {
	exec(
		`git init && git add * && git commit -m "Init: ${projectName}" && git branch -M main`,
		{
			cwd: projectDir,
		},
		(err, stdout, stderr) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(stdout);
		},
	);
}

console.log("Success! Your new project is ready.");
console.log(`Created ${projectName} at ${projectDir}`);
