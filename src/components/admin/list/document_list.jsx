import { useEffect, useState } from "react"

import api from "../../../api";
import FirstPage from "../../getFirstPageFile";

export default function AdminDocumentList(){

    const [docuemnts, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get("/all-documents");
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

	const renderFirstFile = (fileUrl, index) => {
		const fileExtension = fileUrl.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') {
            return <FirstPage key={index} pdfUrl={fileUrl} />;
        } else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
            return <img key={index} src={"http://localhost:8000/archive/files/" + fileUrl} alt={`Document file ${index + 1}`} />;
        }
        return null;

	}
      
    return (
        <>
            <div className="admin-fields-list">
                <p style={{"width":"15%"}}>Заголовок</p>
                <p style={{"width":"15%"}}>Автор</p>
                <p style={{"width":"10%"}}>Дотировка</p>
                <p style={{"width":"20%"}}>Разновидность</p>
                <p style={{"width":"20%"}}>Произ. номер</p>
                <p style={{"width":"20%"}}>Загружен</p>
            </div>

            <div className="admin-list">
               
                {
                    docuemnts.map((doc, index) => {
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
							{
							  doc.file_urls ? (
								<a
								  href={doc.type === "document" 
									? `/admin/document/${doc.id}` 
									: `/admin/phono-document/${doc.id}`}
								  style={{ width: "15%" }}
								>
								  <div className="first-page-file-docs-admin">
									{renderFirstFile(doc.file_urls[0], index)}
								  </div>
								</a>
							  ) : (
								<a
								  href={doc.type === "document" 
									? `/admin/document/${doc.id}` 
									: `/admin/phono-document/${doc.id}`}
								  style={{ width: "15%" }}
								>
								  <div className="first-page-file-docs-admin">Document</div>
								</a>
							  )
							}

							  <p style={{"width":"15%"}}>{doc.author}</p>
                              <p style={{"width":"10%"}}>{doc.dating}</p>
                              <p style={{"width":"20%"}}>{doc.variety}</p>
                              <p style={{"width":"20%"}}>{doc.case_prod_number}</p>
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
