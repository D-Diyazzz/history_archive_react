import FirstPage from "../getFirstPageFile"

export default function ColumnCollections({collections}){
	return(
		<>
			<div className="list-collection-column">
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

						return(
							<div className="list-collection-column-content">
								<div className="list-collection-column-page">
									<FirstPage pdfUrl={`collections/${coll.file_url}`}/>
								</div>
								<div className="list-collection-info">
									<div className="list-collection-info-up">
										<div className="list-collection-title">
											{coll.title}
										</div>
										<div className="list-collection-description">
											Description
										</div>
									</div>

									<div className="list-collection-info-down">
										<div className="list-collection-metadata">
											<p>Дата: {formattedDate}</p>
											<p>Автор: {coll.author.firstname} {coll.author.lastname}</p>
											<p>Тема: {coll.theme}</p>
										
										</div>
										<a href="#" className="list-collection-link">Читать</a>
									</div>
								</div>
							</div>
						)
					})
				}	
			</div>
		</>
	)
}
