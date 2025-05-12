import { useEffect, useState } from "react";
import NotFoundComponent from "../../404_not_found_component";
import api from "../../../api";
import PDFViewer from "../../pdfViewer";
import { FILES_URL } from "../../../config";

export default function DefPhotoDocumentComponent({ documentId }) {
    const [error, setError] = useState(false);
    const [documentelem, setDocument] = useState({});

    useEffect(() => {
        console.log('useEffect triggered with documentId:', documentId);
        const getInfo = async () => {
            try {
                const response = await api.get(`/photo-document/${documentId}`);
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
            <h1 className="document-title">{documentelem.title}</h1>

            {documentelem.file_urls?.map((fileUrl, index) => (
                renderFile(fileUrl, index)
            ))}

            <div className="document-info" style={{"marginTop": "40px"}}>
				<p className="document-author">Автор: {documentelem.author}</p>
				<p className="document-dating">Дата: {documentelem.dating}</p>
				<p className="document-place_of_creating">Место создания: {documentelem.place_of_creating}</p>
				<p className="document-completeness">Полнота воспроизведения: {documentelem.completeness_of_reproduction}</p>
				<p className="document-storage_media">Носитель: {documentelem.storage_media}</p>
				<p className="document-color">Цветность: {documentelem.color}</p>
				<p className="document-size_of_original">Размер оригинала: {documentelem.size_of_original}</p>
				<p className="document-image_scale">Масштаб изображения: {documentelem.image_scale}</p>

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


