import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
	logo: <span>Create Next Gen React App</span>,
	project: {
		link: "https://github.com/clearfeld/create-next-gen-react-app",
	},
	editLink: {
		text: "Edit this page on GitHub",
	},
	docsRepositoryBase: "https://github.com/clearfeld/create-next-gen-react-app/tree/main/docs",
	// chat: {
	//   link: 'https://discord.com',
	// },
	// docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
	primaryHue: 29,
	footer: {
		text: "Create Next Gen React App",
	},
	useNextSeoProps() {
		const { route } = useRouter();
		if (route !== "/") {
			return {
				titleTemplate: "%s – CNGRA",
			};
		}
	},
};

export default config;
