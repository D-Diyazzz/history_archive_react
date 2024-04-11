import { useEffect, useState } from "react"

import api from "../../../api";

export default function AdminClassCollList(){

    const [class_coll, setClassColl] = useState([]);

    useEffect(() => {
        const fetchClassColl = async () => {
            try {
                const response = await api.get("/class-collection");
                setClassColl(response.data); 
            } catch (error) {
                console.error("Ошибка при получении списка документов:", error);
            }
            };
    
            fetchClassColl();
    }, []);


    const deleteClassColl = async (id) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот Вид сборника?");
        if (isConfirmed) {
          try {
            await api.delete(`/class-collection/${id}`);

            setClassColl(class_coll.filter(cls => cls.id !== id));
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
                    class_coll.map((cls) => {
                        return (
                          <>
                            <div className="admin-list-a">
                              <a href="#" style={{"width":"50%"}}>{cls.name}</a>
                              <button onClick={() => deleteClassColl(cls.id)} className="admin-list-delete-button">Del</button>
                            </div>
                          </>
                        );
                      })
                      
                }
            </div>
        </>
    )
}