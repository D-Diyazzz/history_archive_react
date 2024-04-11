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
                                <FirstPage pdfUrl={doc.file_url}/>
                            </div>
                            <div className="document-info">
                                <p className="document-heading">{doc.heading}</p>
                                <p className="document-description">{doc.description_content.length > 300
                                                                    ? `${doc.description_content.slice(0, 300)}...`
                                                                    : doc.description_content}</p>
                                <div className="document-info-addition">
                                    <p className="document-year">Дата: {doc.dating}</p>
                                    <p className="document-author">Автор:  {doc.author}</p>
                                    <p className="document-format">Формат: {doc.format_doc}</p>
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

