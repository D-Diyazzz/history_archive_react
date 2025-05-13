import FirstPage from "./getFirstPageFile"

export default function LinkedDocuments({documents}){
			
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
					<a href={`/document/${obj.id}`}>
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
					</a>
				)

			case "video_document":
				return (
					<a href={`/video-document/${obj.id}`}>
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
					</a>
				)	
			case "photo_document":
				return (
					<a href={`/photo-document/${obj.id}`}>
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
					</a>
				)	

			case "phono_document":
				return (
					<a href={`/phono-document/${obj.id}`}>
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
					</a>
				)	

		}
	}



	return(
		<>
			{
				documents.map((doc, index) => {
					return renderDocument(doc, index)
				})
			}
		</>
	)
}
