import { useEffect, useState } from "react";
import api from "../../../api";

export default function AdminMiniAdminUserList({handleCloseOverlay, setSelectedUsers, selectedUsers, collectionId, typeUser}){

	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try{
				if(typeUser === "SciUser"){
					const response = await api.get("/user/sci")
					setUsers(response.data)
				}else{
					const response = await api.get("/user/redactor")
					setUsers(response.data)
				}
			}catch (error){

			}
		}

		fetchUsers();
	}, [])

	const isUserSelected = (userId) => {
		return selectedUsers.some((selectedU) => selectedU.id === userId)
	}

	const handleSelectUser = async (user) => {
		try{
			const response = await api.post(`/collection/${collectionId}/user_group?user_id=${user.id}`)

			if(response.status == 200){
				setSelectedUsers(prevUsers => [...prevUsers, user]);
				handleCloseOverlay();
			}
		}catch(error){
			console.log(error)
		}
	}

	return(
		<>
			<div className="admin-section-document-mini">
			<div className="document-mini-buttons"> 
				<div className="document-mini-close-button" onClick={handleCloseOverlay}>X</div>
			</div>
			<div className="document-mini-section">
				<div className="document-mini-content">
					<div className="admin-fields-list">
						<p style={{ width: "33%" }}>Имя</p>
						<p style={{ width: "33%" }}>Фамилия</p>
						<p style={{ width: "33%" }}>Почта</p>
				
					</div>
					<div className="admin-mini-list">
						{users
							.filter((user) => !isUserSelected(user.id))
							.map((user) => {
							return(
								<div
									className="admin-list-a admin-list-choise"
									id={user.id}
									key={user.id}
									onClick={() => handleSelectUser(user)}
								
								>
									<p style={{ width: "33%" }}>{user.firstname}</p>
									<p style={{ width: "33%" }}>{user.lastname}</p>
									<p style={{ width: "33%" }}>{user.email}</p>

								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>

		</>
	)
}
