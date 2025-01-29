import { Navigate, useParams } from "react-router-dom";
import NotFoundPage from "../404_not_found";
import AdminNavbar from "../../components/admin/navbar";
import CommentCollectionComponent from "../../components/admin/comment_collection";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function AdminPanelCommentColl(){
	const {id} = useParams();
	const role = localStorage.getItem("user_role");

	if(role === null){
		return(
			<Navigate to="/login"/>
		)
	}
	if(role === "BasicUser" || role === "AdminUser"){
		return(
			<NotFoundPage/>
		)
	}

	return(
		<>
			<Header active={"Админ панель"}/>
			<main>
				<div className='admin-container'>
					<div className='admin-navbar'>
						<AdminNavbar active={"collection"} role={role}/>
					</div>

					<div className="admin-section">
						<CommentCollectionComponent collectionId={id} user_role={role}/>
					</div>
				</div>
			</main>
			<Footer/>
		</>
	)
}
