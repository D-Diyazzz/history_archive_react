import { useEffect, useState } from "react"

import api from "../../../api";
import FirstPage from "../../getFirstPageFile";
import { FILES_URL } from "../../../config";

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
            return <img key={index} src={FILES_URL + fileUrl} alt={`Document file ${index + 1}`} />;
        }
        return null;

	}

	const getDocumentLink = (doc) => {
	  switch (doc.type) {
		case "document":
		case "phono_document":
		  return `/admin/document/${doc.id}`;
		case "photo_document":
		  return `/admin/photo-document/${doc.id}`;
		case "video_document":
		  return `/admin/video-document/${doc.id}`;
		default:
		  return "#";
	  }
	};
      
    return (
        <>
            <div className="admin-fields-list">
                <p style={{"width":"15%"}}>Заголовок</p>
                <p style={{"width":"15%"}}>Автор</p>
                <p style={{"width":"10%"}}>Датировка</p>
                <p style={{"width":"20%"}}>Место создания</p>
                <p style={{"width":"20%"}}>Тип</p>
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
							<div
							  className="admin-list-a"
							  onClick={() => window.location.href = getDocumentLink(doc)}
							  style={{ cursor: "pointer", display: "flex", gap: "10px" }}
							>
							  <a href={getDocumentLink(doc)} style={{ width: "15%" }}>
								<div className="first-page-file-docs-admin">
								{doc.file_urls
									? renderFirstFile(doc.file_urls[0], index)
									: "Document"}
								</div>
							  </a>

							  <p style={{"width":"15%"}}>{doc.author}</p>
                              <p style={{"width":"10%"}}>{doc.dating}</p>
                              <p style={{"width":"20%"}}>{doc.place_of_creating}</p>
                              <p style={{"width":"20%"}}>{doc.type}</p>
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
