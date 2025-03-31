import { useState } from "react";
import "./App.css";
import Home from "../components/pages/home";
import Header from "../components/header";
import Footer from "../components/footer";

function App() {
	return (
		<>
			<Header/>
			<Home/>
			<Footer/>
		</>
	);
}

export default App;
