import { useEffect, useState } from "react";
import PDFViewer from "../../pdfViewer";
import { FILES_URL } from "../../../config";
import NotFoundComponent from "../../404_not_found_component";
import api from "../../../api";

export default function DefPhonoDocumentComponent({ documentId }) {
    const [error, setError] = useState(false);
    const [documentelem, setDocument] = useState({});

    useEffect(() => {
        console.log('useEffect triggered with documentId:', documentId);
        const getInfo = async () => {
            try {
                const response = await api.get(`/phono-document/${documentId}`);
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
                <p className="document-genre">Жанр: {documentelem.genre}</p>
                <p className="document-brief_summary">Краткое описание: {documentelem.brief_summary}</p>
                <p className="document-cypher">Шифр: {documentelem.cypher}</p>
				<p className="document-lang">Язык: {documentelem.lang}</p>
				<p className="document-storage_media">Место хранение: {documentelem.storage_media}</p>

                <p className="document-created_at">Дата создания: {new Date(documentelem.created_at).toLocaleString()}</p>
            </div>
        </div>
    );
}


