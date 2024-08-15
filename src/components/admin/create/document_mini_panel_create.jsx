import { useState } from "react"
import AdminDocumentList from "../list/document_list";
import AdminMiniDocumentList from "../mini_components/list_all_documents";


export default function DocumentMiniPanelCreate({handleCloseOverlay, setSelectedDocuments}) {

	const [currentDocType, setCurrentDocType] = useState("all");
	
	const handleChangeDocType = (type) => {
		setCurrentDocType(type);
	}

	const renderComponent = () => {
		switch (currentDocType){
			case 'all':
				return <AdminMiniDocumentList handleSelectDocument={handleSelectDocument}/>;
		}
	}

	const handleSelectDocument = (file, type) => {
		const object = {
			"file": file,
			"type": type
		}
		
		setSelectedDocuments(prevDocuments => [...prevDocuments, object]);
		handleCloseOverlay();
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
