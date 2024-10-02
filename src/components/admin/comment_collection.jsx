import { useEffect, useState } from "react";
import NotFoundComponent from "../404_not_found_component";
import api from "../../api";


export default function CommentCollectionComponent({collectionId}){
	const [collectionElem, setCollectionElem] = useState([]);
	const [error, setError] = useState(false)
	const [isApproved, setIsApproved] = useState(false)

	const user_id = localStorage.getItem("user_id");

	useEffect(() => {
		const getInfo = async() => {
			try{
				const response = await api.get(`collection/${collectionId}/admin`)
				setCollectionElem(response.data)

				const user = response.data.scientific_council_group.find(user => user.id === user_id);
				setIsApproved(user.is_approved)
			}catch(error){
				setError(true)
				console.log(error)
			}
		}
		getInfo();

	}, [collectionId])

	if(error){
		return <NotFoundComponent />;
	}

	const handleApprove = async () => {
		if(isApproved){
			try{
				const response = await api.patch(`/collection/${collectionId}/sci_group?approve=false`)
				if(response.status === 200){
					setIsApproved(false)
				}
			}catch(error){

			}
		}else{
			try{
				const response = await api.patch(`/collection/${collectionId}/sci_group?approve=true`)
				if(response.status === 200){
					setIsApproved(true)
				}
			}catch(error){

			}
		}
	}


	return(
	<>
		<p className="collection-title-text">{collectionElem.title}</p>
		
		<div className="collection-section">
			<div className="collection-section-row">
				<div className="def-collection"> 
					<div className="collection-row">
							<div className="collection-row-key">
								<p>Название:</p>
							</div>
							<div className="collection-row-value">
								<p>{collectionElem.title}</p>
							</div>
						</div>
						
						<div className="collection-row">
							<div className="collection-row-key">
								<p>Тема:</p>
							</div>
							<div className="collection-row-value">
								<p>{collectionElem.theme}</p>
							</div>
						</div>

						<div className="admin-form-row">
							<div className="admin-form-row-label">
								<label htmlFor="approve">Одобренно</label>
							</div>
							
							<div className="toggle-container">
								<label class="switch">
									<input type="checkbox" checked={isApproved} onChange={handleApprove}/>
									<span class="slider round"></span>
								</label>
								<p className="toggle-p" id="toggle-state">{isApproved ? 'Да' : 'Нет'}</p>
							</div>
						</div>


				</div>
			</div>
		</div>
	</>
	)
}
