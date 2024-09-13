import { useEffect, useState } from "react";
import api from "../../api";
import NotFoundComponent from "../404_not_found_component";

import "../../style/partials/collection.css"
import PDFViewer from "../pdfViewer";
import { useNavigate } from "react-router-dom";


export default function DefCollectionComponent({collectionId}){
	const [collectionElem, setCollectionElem] = useState({});
	const [error, setError] = useState(false)
	const navigate = useNavigate();

	useEffect(() => {
		const getInfo = async() => {
			try{
				const response = await api.get(`collection/${collectionId}/admin`);
				/* const response = await api.get(`collection/%7Bid%7D/admin?document_id=${collectionId}`) */
				setCollectionElem(response.data);
				console.log(collectionElem.file_url)
			}catch (error) {
				setError(true);
			}
		}

		if (collectionId){
			getInfo();
		}else{
			setError(true);
		}
	}, [collectionId]);


	if(error){
		return <NotFoundComponent />;
	}

	const renderFiles = () => {

	}

	const renderSiCouncilGroup = () => {

	}

const renderRedactorGroup = () => {

	}

	const openSessionToEdit = async() => {
		try{
			const response = await api.post(`collection/${collectionId}/session`)
			navigate(`/admin/update/collection/${collectionId}`)
		}catch(error){
			
		}
	}	

	return (
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
						
						<div className="collection-pdf-file">
							<PDFViewer pdfUrl={`collections/${collectionElem.file_url}`}/>	
						</div>

						<div className="collection-edit-button-block">
							<button className="create-button" onClick={openSessionToEdit}>Редактировать -></button>
						</div>
					</div>

					<div className="collection-addition-info">
						<div className="collection-docs">
							<p>Документы</p>
						</div>
						
						<div className="collection-sci-council-group">
							<p>Научный совет</p>
						</div>

						<div className="collection-redactor-group">
							<p>Редакторы</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)


}
