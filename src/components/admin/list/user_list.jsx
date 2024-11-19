import { useEffect, useState } from "react";
import api from "../../../api";
import editing_icon from "../../../style/images/icon-editing.png";

export default function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // ID выбранного пользователя
    const [newRole, setNewRole] = useState(""); // Новая роль для пользователя
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние окна

    useEffect(() => {
        const fetchObject = async () => {
            try {
                const response = await api.get("/user");
                setUsers(response.data);
            } catch (error) {
                console.error("Ошибка при получении списка:", error);
            }
        };

        fetchObject();
    }, []);

    const openRoleModal = (user) => {
        setSelectedUser(user); // Сохраняем пользователя
        setNewRole(user.role); // Устанавливаем текущую роль
        setIsModalOpen(true); // Открываем окно
    };

    const closeRoleModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setNewRole("");
    };

    const handleRoleChange = async () => {
        if (selectedUser && newRole) {
            try {
				const dataToSend = {
					new_role: newRole
				}
                const response = await api.patch(`/user/role/${selectedUser.id}`, dataToSend); // Отправляем данные на сервер
				if(response.status == 200){
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUser.id ? { ...user, role: newRole } : user
                    )
                ); // Обновляем состояние списка пользователей
                closeRoleModal(); // Закрываем модальное окно
				}
            } catch (error) {
                console.error("Ошибка при изменении роли:", error);
            }
        }
    };

    return (
        <>
            <div className="admin-fields-list">
                <p style={{ width: "25%" }}>Почта</p>
                <p style={{ width: "25%" }}>Имя</p>
                <p style={{ width: "25%" }}>Фамилия</p>
                <p style={{ width: "25%" }}>Роль</p>
            </div>

            <div className="admin-list">
                {users.map((user) => (
                    <div className="admin-list-a" key={user.id}>
                        <p style={{ width: "25%" }}>{user.email}</p>
                        <p style={{ width: "25%" }}>{user.firstname}</p>
                        <p style={{ width: "25%" }}>{user.lastname}</p>
                        <p style={{ width: "25%" }}>
                            {user.role}{" "}
                            <img
                                src={editing_icon}
                                onClick={() => openRoleModal(user)} // Открываем окно с текущим пользователем
                                style={{ cursor: "pointer" }}
                                alt="Редактировать роль"
                            />
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Выберите новую роль для {selectedUser.firstname} {selectedUser.lastname}</h3>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="AdminUser">Админ</option>
                            <option value="BasicUser">Обычный пользователь</option>
                            <option value="ScientificCouncil">Научный совет</option>
							<option value="RedactoUser">Редактор</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={handleRoleChange}>Сохранить</button>
                            <button onClick={closeRoleModal}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

