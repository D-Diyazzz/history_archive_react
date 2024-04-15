import { useEffect, useState } from "react";

import PDFViewer from "../pdfViewer"
import NotFoundComponent from "../404_not_found_component";
import api from "../../api";


export default function DefDocumentComponent({documentId}){

    const [error, setError] = useState(false);
    const [documentelem, setDocument] = useState({});

    useEffect(() => {
        const getInfo = async () => {
            try{
                const response = await api.get(`/document/${documentId}`);
                setDocument(response.data);
                console.log(response.data)
            } catch (error){
                console.log(error)
                setError(true);
            }
        }

        getInfo();
    }, [documentId])

    if (error) {
        return <NotFoundComponent />;
    }


    return(
        <div className="def-document">
                <h1 className="document-title">{documentelem.title}</h1> 

                {/* <MyPdfViewer pdfUrl={documentelem.file_url} startPage={1}/> */}
                <PDFViewer pdfUrl={documentelem.file_url}/>

                <div className="document-info">
                    <p className="document-heading">{documentelem.heading}</p>
                    <p className="document-author">Автор: {documentelem.author}</p>
                    <p className="document-dating">Дата: {documentelem.dating}</p>
                    
                    <p className="document-legends">Легенды:</p>
                    <p className="document-legends" dangerouslySetInnerHTML={{ __html: documentelem.legends }}></p>
                    
                    <p className="document-format">Формат: {documentelem.format_doc}</p>
                    <p className="document-color-palette">Цветовая-палитра(оцифровка): {documentelem.color_palette}</p>
                    <p className="document-resolution">Разрешение: {documentelem.resolution}</p>
                    <p className="document-compression">Сжатие: {documentelem.compression}</p>
                    <p className="document-scanner-model">Модель сканера: {documentelem.scanner_model}</p>
                    <p className="document-description">Описание: {documentelem.description_content}</p>
                </div>
            </div>
    )
}