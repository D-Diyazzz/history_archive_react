import { useEffect, useState } from "react"
import api from "../../../api"


export default function AdminCollectionList(){
	const [collections, setCollections] = useState([]);

	// useEffect(() => {
	// 	try{
	// 		const response = await api.get("/collection");
	// 		setCollections(response.data);
	// 	} catch(error){
	//
	// 	}
	// }, []);
	
	return (
		<>
			<div className="admin-fields-list"> 
			</div>
		</>
	)
}
