import { useEffect, useState } from "react"

import Header from "../components/header"
import Footer from "../components/footer"
import FirstPage from "../components/getFirstPageFile"
import api from "../api"

import "../style/partials/documents.css"


export default function Documents(){

    const [documents, setDocuments] = useState([]);

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

    return(
        <>
            <Header active={"Документы"}/>
            
            <main>
                <div className="documents">

                    {documents.map((doc) => (
                        <>
                        <a href={`/document/${doc.id}`}>
                        <div className="document" key={doc.id}>
                            <div className="document-page">
                                <FirstPage pdfUrl={doc.file_urls[0]}/>
                            </div>
                            <div className="document-info">
                                <p className="document-heading">{doc.variety}</p>
                        	{doc.brief_content > 300 
					? <p className="document-description" dangerouslySetInnerHTML={{__html: doc.brief_content.slice(0, 300)}}></p>
					: <p className="document-description" dangerouslySetInnerHTML={{__html: doc.brief_content}}></p>
				}
                                <div className="document-info-addition">
                                    <p className="document-year">Дата: {doc.dating}</p>
                                    <p className="document-author">Автор:  {doc.author}</p>
                                    <p className="document-format">Разновидность: {doc.variety}</p>
                                </div>
                        </div>
                        </div>
                        </a>
                        </>
                    ))}
                </div>
            </main>
                
            <Footer/>
        </>
    )
}

