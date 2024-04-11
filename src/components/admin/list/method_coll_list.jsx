import { useEffect, useState } from "react"

import api from "../../../api";

export default function AdminMethodCollList(){

    const [objets, setObjects] = useState([]);

    useEffect(() => {
        const fetchObject = async () => {
            try {
                const response = await api.get("/method-collection");
                setObjects(response.data); 
            } catch (error) {
                console.error("Ошибка при получении списка:", error);
            }
            };
    
            fetchObject();
    }, []);


    const deleteObject = async (id) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот Метод сборника?");
        if (isConfirmed) {
          try {
            await api.delete(`/format-collection/${id}`);

            setObjects(objets.filter(obj => obj.id !== id));
          } catch (error) {
            console.error("Ошибка при удалении:", error);
          }
        }
      };
      
    return (
        <>
            <div className="admin-fields-list">
                <p style={{"width":"50%"}}>Название</p>
            </div>

            <div className="admin-list">
               
                {
                    objets.map((obj) => {
                        return (
                          <>
                            <div className="admin-list-a">
                              <a href="#" style={{"width":"50%"}}>{obj.name}</a>
                              <button onClick={() => deleteObject(obj.id)} className="admin-list-delete-button">Del</button>
                            </div>
                          </>
                        );
                      })
                      
                }
            </div>
        </>
    )
}