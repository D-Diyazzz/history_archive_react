import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import Header from "../components/header"
import Footer from "../components/footer"
import api from "../api";
// import MyPdfViewer from "../components/pdfViewer";
import PDFViewer from "../components/pdfViewer";

import "../style/partials/def_document.css"


export default function DefDocument(){
    const {documentId} = useParams();
    const [documentelem, setDocument] = useState({});
    useEffect(() => {
        const fetchDocument = async () => {
            try{
                console.log(1)
                const response = await api.get(`/document/${documentId}`);
                setDocument(response.data);
            } catch (error){
                console.log(111)
                console.log(error)
            }
        }

        fetchDocument();
    }, [documentId])

    return(
        <>
        <Header active={"Документ"}/>
        
        <main>
            <div className="def-document">
                <h1 className="document-title">{documentelem.title}</h1> 

                {/* <MyPdfViewer pdfUrl={documentelem.file_url} startPage={1}/> */}
                <PDFViewer pdfUrl={documentelem.file_url}/>

                <div className="document-info">
                    <p className="document-heading">{documentelem.heading}</p>
                    <p className="document-author">Автор: {documentelem.author}</p>
                    <p className="document-dating">Дата: {documentelem.dating}</p>
                    <p className="document-legends">Легенды: {documentelem.legends}</p>
                    <p className="document-format">Формат: {documentelem.format_doc}</p>
                    <p className="document-color-palette">Цветовая-палитра(оцифровка): {documentelem.color_palette}</p>
                    <p className="document-resolution">Разрешение: {documentelem.resolution}</p>
                    <p className="document-compression">Сжатие: {documentelem.compression}</p>
                    <p className="document-scanner-model">Модель сканера: {documentelem.scanner_model}</p>
                    <p className="document-description">Описание: {documentelem.description_content}</p>
                </div>
            </div>
        </main>

        <Footer/>
        </>
    )
}