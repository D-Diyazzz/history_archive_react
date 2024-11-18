import { useEffect, useState } from "react";
import api from "../../api";

export default function CommentWindow({ onClose , coll_id, user_id, user_email}){
	const [comment, setComment] = useState(null);

	// Запрос на получение комментария при монтировании компонента
	useEffect(() => {
		setComment(null);
		const fetchComment = async () => {
			try {
				const response = await api.get(`/collection/${coll_id}/comment/${user_id}`);
				console.log(response)
				setComment(response.data.text); // Предполагаем, что комментарий возвращается в поле `comment`
			} catch (error) {
				console.error("Error fetching user comment:", error);
				setComment("Failed to load comment.");
			}
		};

		fetchComment();
	}, [coll_id]);

	return (
		<div className="comment-window">
			<div className="comment-user-info">
				<div className="comment-user-email">
					{user_email}
				</div>	
			</div>
			<div className="comment-content" dangerouslySetInnerHTML={{ __html: comment || "Loading..." }}>
							</div>
		</div>
	
    );}
