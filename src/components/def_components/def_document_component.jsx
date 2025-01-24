import { useEffect, useState } from "react";

import PDFViewer from "../pdfViewer";
import NotFoundComponent from "../404_not_found_component";
import api from "../../api";
import { FILES_URL } from "../../config";


export default function DefDocumentComponent({ documentId }) {
    const [error, setError] = useState(false);
    const [documentelem, setDocument] = useState({});

    useEffect(() => {
        console.log('useEffect triggered with documentId:', documentId);
        const getInfo = async () => {
            try {
                const response = await api.get(`/document/${documentId}`);
                setDocument(response.data);
                console.log('Document data:', response.data);
            } catch (error) {
                console.error('API call error:', error);
                setError(true);
            }
        };

        if (documentId) {
            getInfo();
        } else {
            console.warn('documentId is undefined or null:', documentId);
            setError(true);
        }
    }, [documentId]);

    if (error) {
        return <NotFoundComponent />;
    }

    const renderFile = (fileUrl, index) => {
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') {
            return <PDFViewer key={index} pdfUrl={fileUrl} />;
        } else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
            return <img key={index} src={FILES_URL + fileUrl} alt={`Document file ${index + 1}`} style={{ width: '900px', height: 'auto' }} />;
        }
        return null;
    };

    return (
        <div className="def-document">
            <h1 className="document-title">{documentelem.variety}</h1>

            {documentelem.file_urls?.map((fileUrl, index) => (
                renderFile(fileUrl, index)
            ))}

            <div className="document-info">
                <p className="document-author">Автор: {documentelem.author}</p>
                <p className="document-addressee">Адресат: {documentelem.addressee}</p>
                <p className="document-dating">Дата: {documentelem.dating}</p>
                <p className="document-place_of_creating">Место создания: {documentelem.place_of_creating}</p>
                <p className="document-case_prod_number">Номер дела: {documentelem.case_prod_number}</p>
                <p className="document-authenticity">Подлинность: {documentelem.authenticity}</p>
                <p className="document-main_text" dangerouslySetInnerHTML={{ __html: documentelem.main_text }}></p>
                <p className="document-brief_content">Краткое содержание:</p>
                <p className="document-brief_content" dangerouslySetInnerHTML={{ __html: documentelem.brief_content }}></p>

                <div className="document-search_data">
                    <h2>Поисковые данные</h2>
                    <p className="search-cypher">Шифр: {documentelem.search_data?.cypher}</p>
                    <p className="search-fund">Фонд: {documentelem.search_data?.fund}</p>
                    <p className="search-case">Дело: {documentelem.search_data?.case}</p>
                    <p className="search-leaf">Лист: {documentelem.search_data?.leaf}</p>
                    <p className="search-authenticity">Подлинность: {documentelem.search_data?.authenticity}</p>
                    <p className="search-lang">Язык: {documentelem.search_data?.lang}</p>
                    <p className="search-playback_method">Метод воспроизведения: {documentelem.search_data?.playback_method}</p>
                    <p className="search-other" dangerouslySetInnerHTML={{ __html: documentelem.search_data?.other }}></p>
                </div>

                <p className="document-created_at">Дата создания: {new Date(documentelem.created_at).toLocaleString()}</p>
            </div>
        </div>
    );
}

