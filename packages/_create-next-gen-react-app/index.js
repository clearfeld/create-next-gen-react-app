#!/usr/bin/env node

// Usage: npx create-next-gen-react-app@latest

import fs from "node:fs";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

import inquirer from "inquirer";
import chalk from "chalk";

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

await inquirer
	.prompt([
		{
			type: "input",
			name: "project_name",
			message: "Project name:",
			default: "react-app-next-gen",
		},
		{
			type: "list",
			name: "package_manager",
			message: "Package manager:",
			choices: ["npm", "pnpm"],
		},
	])
	.then((answer) => {
		if (answer.project_name === "\\" || answer.project_name === "") {
			console.log(
				chalk.red(
					`Project name can't be ${chalk.underline("empty")} or ${chalk.underline(
						"\\",
					)}.`,
				),
			);
			projectName = undefined;
			process.exit(1);
		}

		projectName = answer.project_name;
		package_manager = answer.package_manager;
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

const templateDir = path.resolve(__dirname, "../create-next-gen-react-app-template");
fs.cpSync(templateDir, projectDir, { recursive: true });

fs.renameSync(path.join(projectDir, "gitignore"), path.join(projectDir, ".gitignore"));

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

console.log("Success! Your new project is ready.");
console.log(`Created ${projectName} at ${projectDir}`);
