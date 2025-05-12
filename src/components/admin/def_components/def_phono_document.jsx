import { useEffect, useState } from "react";
import PDFViewer from "../../pdfViewer";
import { FILES_URL } from "../../../config";
import NotFoundComponent from "../../404_not_found_component";
import api from "../../../api";

import ReactPlayer from "react-player";

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
       return (
            <div key={index} style={{ width: '900px' }}>
			<ReactPlayer
			  url={FILES_URL + fileUrl}
			  controls
			  width="100%"
			  height="auto"
			/>
            </div>
        );
    };

    return (
        <div className="def-document">
            <h1 className="document-title">{documentelem.variety}</h1>

            {documentelem.file_urls?.map((fileUrl, index) => (
                renderFile(fileUrl, index)
            ))}

            <div className="document-info" style={{"marginTop": "40px"}}>
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


