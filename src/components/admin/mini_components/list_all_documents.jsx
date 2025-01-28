import { useEffect, useState } from "react";
import api from "../../../api";
import FirstPage from "../../getFirstPageFile";

export default function AdminMiniDocumentList({ handleSelectDocument, selectedDocuments }) {
    const [documents, setDocuments] = useState([]);
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

    const getFirstFile = (file) => {
        const type = file.split(".")[1];
        switch (type) {
            case 'pdf':
                return <FirstPage pdfUrl={file} />;
            default:
                return null;
        }
    };

    const isDocumentSelected = (docId) => {
        return selectedDocuments.some((selectedDoc) => selectedDoc.id === docId);
    };

    return (
        <>
            <div className="admin-fields-list">
                <p style={{ width: "15%" }}>Файл</p>
                <p style={{ width: "15%" }}>Автор</p>
                <p style={{ width: "10%" }}>Дотировка</p>
                <p style={{ width: "20%" }}>Разновидность</p>
                <p style={{ width: "20%" }}>Произ. номер</p>
                <p style={{ width: "20%" }}>Загружен</p>
            </div>

            <div className="admin-mini-list">
                {documents
                    .filter((doc) => !isDocumentSelected(doc.id)) // Фильтруем только те документы, которых нет в selectedDocuments
                    .map((doc) => {
                        const date = new Date(doc.created_at);
                        const formattedDate = date.toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <div
                                className="admin-list-a admin-list-choise"
                                id={doc.id}
                                key={doc.id}
                                onClick={() => handleSelectDocument(doc)}
                            >
                                <p href={`/admin/document/${doc.id}`} style={{ width: "15%" }}>
								{
									doc.file_urls ? (
										getFirstFile(doc.file_urls[0])
									) : (
										<></>
									)
								}
                                </p>
                                <p style={{ width: "15%" }}>{doc.author}</p>
                                <p style={{ width: "10%" }}>{doc.dating}</p>
                                <p style={{ width: "20%" }}>{doc.variety}</p>
                                <p style={{ width: "20%" }}>{doc.case_prod_number}</p>
                                <p style={{ width: "20%" }}>{formattedDate}</p>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

