import { useEffect, useRef, useState } from "react";
import NotFoundComponent from "../404_not_found_component";
import api from "../../api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FILES_URL } from "../../config";


export default function CommentCollectionComponent({collectionId, user_role}){
	const [collectionElem, setCollectionElem] = useState([]);
	const [error, setError] = useState(false)
	const [isApproved, setIsApproved] = useState(false)

	const user_id = localStorage.getItem("user_id");
	const [comment, setComment] = useState("")
	const commentRef = useRef("");
	const [commentId, setCommentId] = useState();

	useEffect(() => {
		const getInfo = async() => {
			try{
				const response = await api.get(`collection/${collectionId}/admin`)
				setCollectionElem(response.data)

				const comment_response = await api.get(`collection/${collectionId}/comment`)
				const comment_response_data = comment_response.data
				console.log(comment_response_data)
				setComment(comment_response_data.text)
				setCommentId(comment_response_data.id)
				
				if(user_role == "ScientificCouncil"){
					const user = response.data.scientific_council_group.find(user => user.id === user_id);
					setIsApproved(user.is_approved)
				}

				const file = await fetch(FILES_URL + "collections/" + response.data.html_url);
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

	const editComment = async () => {
        // Обновляем только если комментарий изменился
        
            const dataToSend = {
                id: commentId,
                text: comment
            };
            console.log("Sending updated comment:", dataToSend);
            try {
                const response = await api.patch(`/collection/${collectionId}/comment`, dataToSend);
                console.log("Updated comment on server:", response);
                commentRef.current = comment; // Обновляем ref после успешного обновления
            } catch (error) {
                console.log("Failed to update comment:", error);
            }
    };

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
									setComment(data)
									commentRef.current = data
								}}
								onBlur={editComment}
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
