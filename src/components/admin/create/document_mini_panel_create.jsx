import { useState } from "react"
import AdminDocumentList from "../list/document_list";
import api from "../../../api";
import AdminMiniAllDocumentList from "../mini_components/list_all_documents";
import AdminMiniDocumentList from "../mini_components/list_document_mini";


export default function DocumentMiniPanelCreate({handleCloseOverlay, setSelectedDocuments, selectedDocuments, collectionId}) {
	console.log(collectionId)
	const [currentDocType, setCurrentDocType] = useState("all");
	
	const handleChangeDocType = (type) => {
		setCurrentDocType(type);
	}

	const getUrlForType = (type) => {
	  switch (type) {
		case "all": return "/all-documents";
		case "document": return "/document";
		case "photo-doc": return "/photo-document";
		case "video-doc": return "/video-document";
		case "phono-doc": return "/phono-document";
		default: return "/document";
	  }
	}

	const renderComponent = () => {
		return (
		  <AdminMiniDocumentList
			key={currentDocType} // ключ сбросит компонент при смене типа
			handleSelectDocument={handleSelectDocument}
			selectedDocuments={selectedDocuments}
			url={getUrlForType(currentDocType)}
		  />
		);
	}

	const handleSelectDocument = async (file) => {
		try{
			const dataToSend = {
				doc_id: file.id,
				doc_type: file.type
			}
			const response = await api.post(`/collection/${collectionId}/document`, dataToSend)
			console.log(response)
			if(response.status == 200){
				console.log("2000")
				setSelectedDocuments(file);
				handleCloseOverlay();
			}
		}catch(error){
			console.log(error)

		}
	}

	return (
		<div className="admin-section-document-mini">
			<div className="document-mini-buttons"> 
				<div className="document-mini-close-button" onClick={handleCloseOverlay}>X</div>
			</div>
			<div className="document-mini-section">
				<div className="document-mini-section-navbar">
					<p 
						className={currentDocType === "all" ? "doc-mini-navbar-elem-active" : "doc-mini-navbar-elem"}
						onClick={(e) => {handleChangeDocType("all")}}
					>Все</p>
					<p
						className={currentDocType === "document" ? "doc-mini-navbar-elem-active" : "doc-mini-navbar-elem"}
						onClick={(e) => {handleChangeDocType("document")}}
					>Документы</p>
					<p
						className={currentDocType === "photo-doc" ? "doc-mini-navbar-elem-active" : "doc-mini-navbar-elem"}
						onClick={(e) => {handleChangeDocType("photo-doc")}}
					>Фотодокументы</p>
					<p
						className={currentDocType === "phono-doc" ? "doc-mini-navbar-elem-active" : "doc-mini-navbar-elem"}
						onClick={(e) => {handleChangeDocType("phono-doc")}}
					>Фонодокументы</p>
					<p
						className={currentDocType === "video-doc" ? "doc-mini-navbar-elem-active" : "doc-mini-navbar-elem"}
						onClick={(e) => {handleChangeDocType("video-doc")}}
					>Кинодокументы</p>
				</div>
				<div className="document-mini-content">
					{renderComponent()}	
				</div>
			</div>
		</div>
	)
}
