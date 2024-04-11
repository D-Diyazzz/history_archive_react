import { useEffect, useState } from "react"

import api from "../../../api";

export default function AdminFormatCollList(){

    const [format_coll, setFormatColl] = useState([]);

    useEffect(() => {
        const fetchFormatColl = async () => {
            try {
                const response = await api.get("/format-collection");
                setFormatColl(response.data); 
            } catch (error) {
                console.error("Ошибка при получении списка:", error);
            }
            };
    
            fetchFormatColl();
    }, []);


    const deleteFormatColl = async (id) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот Формат сборника?");
        if (isConfirmed) {
          try {
            await api.delete(`/format-collection/${id}`);

            setFormatColl(format_coll.filter(format => format.id !== id));
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
                    format_coll.map((format) => {
                        return (
                          <>
                            <div className="admin-list-a">
                              <a href="#" style={{"width":"50%"}}>{format.name}</a>
                              <button onClick={() => deleteFormatColl(format.id)} className="admin-list-delete-button">Del</button>
                            </div>
                          </>
                        );
                      })
                      
                }
            </div>
        </>
    )
}