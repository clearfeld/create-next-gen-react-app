import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ command, mode }) => {
	// Loads our env file and merges it with Node's process.env
	// prevents issues with jest
	Object.assign(process.env, loadEnv(mode, process.cwd()));

	if (command === "serve") {

		// Dev config

		return defineConfig({
			root: "src",
			mode: "development",

			build: {
				// Relative to the root
				outDir: "../dist",
				emptyOutDir: true,
			},

			server: {
				open: "/",
			},

			define: {
				"process.env": process.env,
			},

			publicDir: "../public",

			plugins: [
				// createHtmlPlugin({
				//   inject: {
				//     data: {
				//       title: env === 'production' ? 'My site' : `My site [${env.toUpperCase()}]`,
				//     },
				//   },
				// }),

				svgr(),

				react({
					// Use React plugin in all *.jsx and *.tsx files
					include: "**/*.{jsx,tsx}",
				}),

				checker({
					typescript: true,
				}),

				eslint({
					overrideConfigFile: path.resolve(__dirname, ".eslintrc.cjs"),
				}),
			],

			resolve: {
				alias: {
					"@src": path.resolve(__dirname, "src"),
					"@store": path.resolve(__dirname, "src/store"),
				},
			},
		});
	} else {

		// prod config

		return defineConfig({
			root: "src",
			mode: "production",

			build: {
				// Relative to the root
				outDir: "../dist",
				emptyOutDir: true,

				// https://rollupjs.org/configuration-options/
				// rollupOptions: {
				// }
			},

			define: {
				"process.env": process.env,
			},

			publicDir: "../public",

			plugins: [
				// createHtmlPlugin({
				//   inject: {
				//     data: {
				//       title: env === 'production' ? 'My site' : `My site [${env.toUpperCase()}]`,
				//     },
				//   },
				// }),

				svgr(),

				react({
					// Use React plugin in all *.jsx and *.tsx files
					include: "**/*.{jsx,tsx}",
				}),

				checker({
					typescript: true,
				}),

				eslint({
					overrideConfigFile: path.resolve(__dirname, ".eslintrc.cjs"),
				}),
			],

			resolve: {
				alias: {
					"@src": path.resolve(__dirname, "src"),
					"@store": path.resolve(__dirname, "src/store"),
				},
			},
		});
	}
});
