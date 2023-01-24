"use strict";

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const webpack = require("webpack");
const path = require("path");
const { env } = require("process");

module.exports = {
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
