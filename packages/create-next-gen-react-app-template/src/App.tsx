import React from "react";
import Logo from "./logo.svg";
import "./App.css";

function App() {
	return (
		<div className="App">
			<Logo
				className="logo"
				title="logo"
				alt="logo"
			/>

			<h1 className="title">React</h1>

			<div>
				<p>Edit src\App.tsx and save to reload.</p>
				<a
					className="link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</div>
		</div>
	);
}

export default App;
