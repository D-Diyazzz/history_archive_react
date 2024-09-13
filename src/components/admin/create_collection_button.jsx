import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function CreateCollectionButtons(){
	const navigate = useNavigate();

	const id = localStorage.getItem("user_id");
	const createDefaultCollection = async () => {
		try{
			const dataToSend = {
				theme: "Научно-популярный",
				title: "Новый сборник",
			}
			console.log(dataToSend)
			const response = await api.post("/collection", dataToSend)
			const coll_id = response.data["id"]
			console.log(coll_id)
			navigate(`/admin/collection/${coll_id}`)
		}
		catch (error){

		}
	}

    return(
        <div className="create-delete-buttons-container">
            <button className="create-button" onClick={createDefaultCollection}> + Добавить</button>
        </div>
    )
}
