import { useEffect, useState } from "react"
import api from "../api"
import Header from "../components/header"
import MainInfo from "../components/main/main_info"
import MainFirstColl from "../components/main/main_last_coll"

import "../style/partials/home.css"
import MainLastComponent from "../components/main/main_last_component"


export default function Main(){

	const componentsList = [MainInfo, MainFirstColl, MainLastComponent];
	const [collections, setCollections] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const getCollections = async () => {
			try {
				const response = await api.get("/collection");
				setCollections(response.data);
				console.log("Response:", response);
		  	} catch (error) {
				console.error("Ошибка при получении коллекций:", error);
		  	}
		};
		console.log("useEffect");
		getCollections();
	}, []);

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % componentsList.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + componentsList.length) % componentsList.length);
	};

	const CurrentComponent = componentsList[currentIndex];

	return (
		<>
			<Header active="main" />
		  	{/* Передаём коллекции и функции переключения в дочерний компонент */}
		  	<CurrentComponent 
				collections={collections} 
				handleNext={handleNext} 
				handlePrev={handlePrev}
		  	/>
		</>
	);
}
