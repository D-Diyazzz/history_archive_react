import { useEffect, useState } from "react";

import "../../../style/partials/collection.css"
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import NotFoundComponent from "../../404_not_found_component";
import PDFViewer from "../../pdfViewer";
import FirstPage from "../../getFirstPageFile";


export default function AdminDefCollectionComponent({collectionId}){
	const [collectionElem, setCollectionElem] = useState({});
	const [documents, setDocuments] = useState([])
	const [sciUsers, setSciUsers] = useState([])
	const [redactorUsers, setRedactorUsers] = useState([])
	const [error, setError] = useState(false)
	const navigate = useNavigate();

	const user_role = localStorage.getItem("user_role")

	useEffect(() => {
		const getInfo = async() => {
			try{
				const response = await api.get(`collection/${collectionId}/admin`);
				/* const response = await api.get(`collection/%7Bid%7D/admin?document_id=${collectionId}`) */
				setCollectionElem(response.data);
				setDocuments(response.data.documents)
				setSciUsers(response.data.scientific_council_group)
				setRedactorUsers(response.data.redactor_group)
				setIsApproved(response.data.is_approved)
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


	const openSessionToEdit = async() => {
		try{
			const response = await api.post(`collection/${collectionId}/session`)
			if(response.status === 200){
				navigate(`/admin/update/collection/${collectionId}`)
			}
		}catch(error){
			
		}
	}

	const redirectToCommentPage = () => {
		navigate(`/admin/collection/${collectionId}/comment`)
	}	

	const getFirstFile = (file) => {
		const type = file.split(".")[1]
		switch (type){
			case 'pdf':
				return <FirstPage pdfUrl={file} /> 
		}
	}


	const renderDocument = (obj, index) => {
		switch (obj.type){
			case "document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-file">
							{
								obj.file_urls ? (
									getFirstFile(obj.file_urls[0])
								):(
									<></>
								)
							}
							</div>
							<div className="document-selected-info">
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Адресат: {obj.addressee}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>

	
								
							</div>
							
						</div>

					</div>
				)

			case "video_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					</div>
				)	
			case "photo_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					</div>
				)	

			case "phono_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					</div>
				)	

		}
	}


	const renderSciUser = (obj) => {
		return (
			<div className="admin-selected-u">
				<div className="user-selected">
					<div className="user-selected-photo">
					</div>

					<div className="user-selected-info">
						<p className="user-selected-name">{obj.firstname} {obj.lastname}</p>
						<p className="user-selected-email">{obj.email}</p>
					</div>
					
					<div className="user-selected-approved">
						<div className={obj.is_approved ? 'user-selected-approved-t' : 'user-selected-approved-f'}>
						</div>
					</div>
				</div>
			</div>
		)
	}

		const renderAdminUser = (obj) => {
		return (
			<div className="admin-selected-u">
				<div className="user-selected">
					<div className="user-selected-photo">
					</div>

					<div className="user-selected-info">
						<p className="user-selected-name">{obj.firstname} {obj.lastname}</p>
						<p className="user-selected-email">{obj.email}</p>
					</div>
				</div>
			</div>
		)
	}

	const [isApproved, setIsApproved] = useState(false)



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

						<div className="collection-row">
							<div className="collection-row-key">
								<p>Одобренно:</p>
							</div>	
							<div className="collection-row-value">
								<p>{isApproved ? "Да" : "Нет"}</p>
							</div>
						</div>
					
						<div className="collection-row">
							<div className="collection-row-key">
								<p>ISBN:</p>
							</div>
							<div className="collection-row-value">
								<p>{collectionElem.isbn_link}</p>
							</div>
						</div>
						
						<div className="collection-pdf-file">
							<PDFViewer pdfUrl={`collections/${collectionElem.file_url}`}/>	
						</div>


						<div className="collection-edit-button-block">
							{user_role === 'AdminUser' || user_role === 'RedactorUser' || user_role === 'SuperAdminUser' ? (
								<button className="create-button" onClick={openSessionToEdit}>Редактировать -></button>
							) : (
								<>
								</>
							)

							}
							{user_role === 'RedactorUser' || user_role === 'ScientificCouncil' ? (
								<button className="create-button" onClick={redirectToCommentPage}>Коментировать -></button>
							):
							(
								<>
								</>
							)

							}
						</div>
					</div>

					<div className="admin-section-add">
						<div className="admin-section-add-docs">
							<p className="add-docs-p"><strong>Документы:</strong></p>
							{
								documents.map((doc, index) => {
									return renderDocument(doc, index);
								})
							}	
						</div>
						
						<div className="admin-section-add-docs">
							<p className="add-docs-p"><strong>Научный совет:</strong></p>
							{
								sciUsers.map((user) => {
									return renderSciUser(user)
								})
							}
						</div>

						<div className="admin-section-add-docs">
							<p className="add-docs-p"><strong>Редакторы:</strong></p>

							{
								redactorUsers.map((user) => {
									return renderAdminUser(user)
								})
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)


}

