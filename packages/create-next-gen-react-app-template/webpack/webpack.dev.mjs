import path from "node:path";
import { env } from "node:process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
// import fs from "node:fs";

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import Dotenv from "dotenv-webpack";

import webpack from "webpack";

// const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Config = {
	mode: "development",
	entry: "../src/index.tsx",
	context: __dirname,

	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "template.bundle.js",
		chunkFilename: "[name].bundle.js",
	},

	devServer: {
		port: env.PORT ? env.PORT : "auto", // TODO: add env variable for port
		hot: true,
		compress: true,

		static: [
			{
				publicPath: env.PUBLIC_URL ? `${env.PUBLIC_URL}` : "/",
			},
		],

		open: [env.PUBLIC_URL ? `${env.PUBLIC_URL}` : "/"],

		client: {
			logging: "info",
			overlay: {
				warnings: true,
				errors: true,
			},
		},
	},

	plugins: [new ReactRefreshWebpackPlugin(), new Dotenv()],

	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@src": path.resolve(__dirname, "../src"),
		},
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.join(__dirname, "../src"),
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "typescript",
							},
							transform: {
								react: {
									development: true,
									refresh: true,
								},
							},
						},
					},
				},
			},

			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader"],
			},

			{
				test: /\.svg$/,
				use: [
					{
						loader: "@svgr/webpack",
					},
				],
			},
		],
	},
};

export default Config;
