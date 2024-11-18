import { useEffect, useState } from "react"
import api from "../../../api"


export default function AdminCollectionList(){
	const [collections, setCollections] = useState([]);

	useEffect(() => {
		const fetchDocuments = async () => {
			try{
				const response = await api.get("/collection/admin_list");
				setCollections(response.data);
			} catch(error){

			}
		}
		fetchDocuments()
	}, []);
	
	return (
		<>
			<div className="admin-fields-list"> 
				<p style={{"width":"20%"}}>Название</p>
                <p style={{"width":"15%"}}>Тема</p>
                <p style={{"width":"15%"}}>Автор</p>
				<p style={{"width":"10%"}}>Email</p>
                <p style={{"width":"10%"}}>Хэш код</p>
                <p style={{"width":"10%"}}>Одобрен</p>
                <p style={{"width":"20%"}}>Создан</p>
			</div>

			<div className="admin-list">
				{
					collections.map((coll) => {
						const date = new Date(coll.created_at);
                        const formattedDate = date.toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        });	

					let is_approved_field = "Нет";

					if(coll.is_approved){
						is_approved_field = "Да";
					}

					return (
                          <>
                            <div className="admin-list-a">
                              <a href={`/admin/collection/${coll.id}`} style={{"width":"20%"}}>{coll.title}</a>
                              <p style={{"width":"15%"}}>{coll.theme}</p>
                              <p style={{"width":"15%"}}>{coll.author.firstname} {coll.author.lastname}</p>
							  <p style={{"width":"10%"}}>{coll.author.email}</p>
                              <p style={{"width":"10%"}}>{coll.hash_code}</p>
                              <p style={{"width":"10%"}}>{is_approved_field}</p>
                              <p style={{"width":"20%"}}>{formattedDate}</p>
                            </div>
                          </>
                        );
					})
				}
			</div>
		</>
	)
}
