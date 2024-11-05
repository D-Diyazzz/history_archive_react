import { useEffect, useState } from "react";
import NotFoundComponent from "../404_not_found_component";
import api from "../../api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


export default function CommentCollectionComponent({collectionId}){
	const [collectionElem, setCollectionElem] = useState([]);
	const [error, setError] = useState(false)
	const [isApproved, setIsApproved] = useState(false)

	const user_id = localStorage.getItem("user_id");
	const [comment, setComment] = useState("")

	useEffect(() => {
		const getInfo = async() => {
			try{
				const response = await api.get(`collection/${collectionId}/admin`)
				setCollectionElem(response.data)

				const user = response.data.scientific_council_group.find(user => user.id === user_id);
				setIsApproved(user.is_approved)

				const file = await fetch(`http://localhost:8000/archive/files/collections/${response.data.html_url}`);
				const file_text = await file.text()
				const regex = /<\/head>([\s\S]*)<\/html>/;
				const match = file_text.match(regex);


				const contentDiv = document.getElementById("pdf-redactor-page-section");

				if(match && match[1].trim()){
					contentDiv.innerHTML = match[1];
				}
				document.querySelectorAll('.pdf-redactor-page-edit').forEach(element => {
					element.contentEditable = "false";
				});


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

	const handleCKEditorChange = (data) => {
		setComment(data)
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

						<div className="pdf-redactor-section" style={{height: "700px"}}>
							<div className="pdf-redactor-page-section" id="pdf-redactor-page-section" style={{height: "700px", borderRadius: "20px 20px 0px 0px"}}>
							</div>
						</div>

						<div className="pdf-comment">
							<CKEditor
								editor={ClassicEditor}
								data={comment}
								onReady={ editor => {

								}}
								onChange={(event, editor) => {
									const data = editor.getData();
									handleCKEditorChange(data)
									console.log(comment)
								}}
							/>
						</div>
				</div>
			</div>
		</div>

		<style>
			{`
				.pdf-redactor-page-tools{
					display: none;
				}
				.pdf-redactor-page{
					margin-right: auto;
				}
			`}
		</style>
	</>
	)
}
