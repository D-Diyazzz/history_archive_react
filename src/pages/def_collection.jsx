import { useParams } from "react-router-dom"
import Header from "../components/header"
import "../style/partials/collection.css"
import { useEffect, useState } from "react"
import PDFViewer from "../components/pdfViewer"
import api from "../api"
import LinkedDocuments from "../components/linked_documents_comp"


export default function DefCollection(){
	const {collId} = useParams()

	const [collectionElem, setCollectionElem] = useState({})


	useEffect(() => {
		const getInfo = async() => {
			try{
				console.log(collId)
				const response = await api.get(`collection/${collId}/admin`)
				console.log(response)
				setCollectionElem(response.data)
			}catch (error){
				console.log(error)	
			}
		}
		getInfo()
	}, [])

	return(
		<>
			<Header active="collection"/>

			<div className="def-collection-content">
				<div className="def-collection-info">
					<p>Название: {collectionElem.title}</p>
					<p>Тема: {collectionElem.theme}</p>
					<p>ISBN: {collectionElem.isbn_link}</p>
				</div>
				
				<div className="def-collection-pages">
					<PDFViewer pdfUrl={`collections/${collectionElem.file_url}`}/>
				</div>

				<div className="def-collection-documents">
					<p><strong>Документы</strong></p>
					{
						collectionElem.documents ? (
							<LinkedDocuments documents={collectionElem.documents} />
						):(
							<></>
						)
					}
				</div>
			</div>
		</>
	)
}
