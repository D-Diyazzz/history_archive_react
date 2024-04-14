import { useEffect, useState } from "react"

import api from "../../../api";

export default function AdminDocumentList(){

    const [docuemnts, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get("/document");
                setDocuments(response.data); 
            } catch (error) {
                console.error("Ошибка при получении списка документов:", error);
            }
            };
    
            fetchDocuments();
    }, []);


    const deleteDocument = async (id) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот документ?");
        if (isConfirmed) {
          try {
            await api.delete(`/document/${id}`);

            setDocuments(docuemnts.filter(doc => doc.id !== id));
          } catch (error) {
            console.error("Ошибка при удалении документа:", error);
          }
        }
      };
      
    return (
        <>
            <div className="admin-fields-list">
                <p style={{"width":"30%"}}>Заголовок</p>
                <p style={{"width":"15%"}}>Автор</p>
                <p style={{"width":"10%"}}>Дотировка</p>
                <p style={{"width":"10%"}}>Тип</p>
                <p style={{"width":"10%"}}>Формат</p>
                <p style={{"width":"20%"}}>Загружен</p>
            </div>

            <div className="admin-list">
               
                {
                    docuemnts.map((doc) => {
                        const date = new Date(doc.created_at);
                        const formattedDate = date.toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      
                        return (
                          <>
                            <div className="admin-list-a">
                              <a href={`/admin/document/${doc.id}`} style={{"width":"30%"}}>{doc.heading}</a>
                              <p style={{"width":"15%"}}>{doc.author}</p>
                              <p style={{"width":"10%"}}>{doc.dating}</p>
                              <p style={{"width":"10%"}}>Документ</p>
                              <p style={{"width":"10%"}}>{doc.format_doc}</p>
                              <p style={{"width":"20%"}}>{formattedDate}</p>
                              <button onClick={() => deleteDocument(doc.id)} className="admin-list-delete-button">Del</button>
                            </div>
                          </>
                        );
                      })
                      
                }
            </div>
        </>
    )
}