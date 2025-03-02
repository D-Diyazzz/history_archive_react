import Header from "../components/header"
import MainInfo from "../components/main/main_info"

import "../style/partials/home.css"


export default function Main(){
	return (
		<>
			<Header active={"main"}/>
			<MainInfo/>
		</>
	)
}
