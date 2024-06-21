import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

import api from "../../../api";
import { validateForm, handleChange } from "../../../utils/formHadlers";
import { addFileInput, removeFileInput, handleFileChange } from "../../../utils/documentHandlers";
import FirstPage from "../../getFirstPageFile";
import ConfirmDialog from "../dialogs";


export default function AdminDocumentUpdateComponent({id}){
    const navigate = useNavigate();

    const [formDataState, setFormData] = useState({
	author: "",
	dating: "",
	place_of_creating: "",
	variety: "",
	addressee: "",
	brief_content: "",
	case_prod_number: "",
	main_text: "",
	cypher: "",
	fund: "",
	inventory: "",
	case: "",
	leaf: "",
	authenticity: "",
	lang: "",
	playback_method: "",
	other: ""
    });

    const [file, setFile] = useState([]);
    const [fileError, setFileError] = useState();

    const [errors, setErrors] = useState({
	author: false,
	dating: false,
	place_of_creating: false,
	variety: false,
	addressee: false,
	brief_content: false,
	case_prod_number: false,
	main_text: false,
	cypher: false,
	fund: false,
	inventory: false,
	case: false,
	leaf: false,
	authenticity: false,
	lang: false,
	playback_method: false,
	other: false
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, fileUrl: null });


    useEffect(() => {
	const getDocument = async () => {
	    try{
		const response = await api.get(`/document/${id}`);
		const documentData = response.data;

		setFormData({
                    author: documentData.author || "",
                    dating: documentData.dating || "",
                    place_of_creating: documentData.place_of_creating || "",
                    variety: documentData.variety || "",
                    addressee: documentData.addressee || "",
                    brief_content: documentData.brief_content || "",
                    case_prod_number: documentData.case_prod_number || "",
                    main_text: documentData.main_text || "",
                    cypher: documentData.search_data.cypher || "",
                    fund: documentData.search_data.fund || "",
                    inventory: documentData.search_data.inventory || "",
                    case: documentData.search_data.case || "",
                    leaf: documentData.search_data.leaf || "",
                    authenticity: documentData.search_data.authenticity || "",
                    lang: documentData.search_data.lang || "",
                    playback_method: documentData.search_data.playback_method || "",
                    other: documentData.other || ""
                });

                setUploadedFiles(documentData.file_urls);
		setDocumentType(documentData.variety)
	    } catch (error) {
		console.log('error', error)
	    }
	};
	
	if (id){
	    getDocument();
	}
    }, [id]);

    const handleSubmit = async (e) => {
	e.preventDefault();

	const validate_data = validateForm(formDataState, setErrors);
	if (!validate_data) {
		console.log(errors)
	    alert('Заполните все поля!')
            return;
        }
        const data = {
            author: formDataState.author,
            dating: formDataState.dating,
            place_of_creating: formDataState.place_of_creating,
            variety: formDataState.variety,
            addressee: formDataState.addressee,
            brief_content: formDataState.brief_content,
            case_prod_number: formDataState.case_prod_number,
            main_text: formDataState.main_text,
            search_data: {
                cypher: formDataState.cypher,
                fund: formDataState.fund,
                inventory: formDataState.inventory,
                case: formDataState.case,
                leaf: formDataState.leaf,
                authenticity: formDataState.authenticity,
                lang: formDataState.lang,
                playback_method: formDataState.playback_method,
                other: formDataState.other
            }
        };

	const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        if (file.length > 0) {
            file.forEach((f, index) => {
                formData.append(`files`, f);
            });
        }
	console.log(formData)

        try {
            const response = await api.patch(`/document/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/admin/document/${id}`);
	} catch (error) {
            if (error.response && error.response.data) {
                console.log('Error:', error.response.data);
                // Optionally set error state to display validation messages
            } else {
                console.log('Error updating document', error);
            }
        }
    }


    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({...prev, [name]: !data}))
    }

    const [documentType, setDocumentType] = useState('');
    const [customType, setCustomType] = useState('');

    const documentOptions = [
        "",
        "Приказ", "Отчет", "Донесение", "Сводка", "Обзор", 
        "Приветствие", "Распоряжение", "Оперативная сводка", 
        "Запись беседы", "Запись разговора", "Решение", 
        "Резолюция", "Обращение", "Петиция", "Акт", 
        "Фотокнига", "Фотоплакат", "Другое"
    ];

    const handleChangeDocType = (event) => {
        const { value } = event.target;
        if(value === 'Другое'){
            setDocumentType("Другое")
            setFormData(prevFormData => ({
                ...prevFormData,
                variety: ""
            }));
        }else{
            setFormData(prevFormData => ({
                ...prevFormData,
                variety: value  
            }));
            setDocumentType(value)
        }

        setErrors(prev => ({...prev, ["variety"]: !value}))
    };

    const handleCustomInputChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            variety: e.target.value
        }));
        setErrors(prev => ({...prev, ["variety"]: !value}))
    };

 //    const addFileInput = () => {
	// setFile([...file, null])
 //    }
    const renderFile = (fileUrl, index) => {
	const fileExtension = fileUrl.split('.').pop().toLowerCase();
	if (fileExtension === 'pdf') {
	    return <FirstPage pdfUrl={fileUrl} height={130}/>
 	} else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
	    return <img key={index} src={"http://localhost:8000/archive/files/" + fileUrl}/>;
	}
	return null;
    }

    const handleFileDelete = async (fileUrl) => {
            try {
                await api.delete(`/document/${id}/file`, { data: [fileUrl] });
                setUploadedFiles(prevFiles => prevFiles.filter(f => f !== fileUrl));
            } catch (error) {
		alert('У документа не может быть 0 фалов');
                console.log('Error deleting file', error);
            }
    };

    const openConfirmDialog = (fileUrl) => {
        setConfirmDialog({ isOpen: true, fileUrl });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ isOpen: false, fileUrl: null });
    };

    const confirmFileDelete = () => {
        handleFileDelete(confirmDialog.fileUrl);
        closeConfirmDialog();
    };


    return(
	<>
    	    <p className="admin-title-text">Обновить документ</p>
	    
	    <form className="admin-section-create-form" onSubmit={handleSubmit}>
                <div className="admin-section-form-inputs">
		
		    <div className="admin-files">
	    		{uploadedFiles.map((f, index) => (
			    <div className="admin-files-block" key={index}>
				<div className="admin-files-block-file"> {renderFile(f,index)} </div>
				<button type="button" className="remove-upload-file-button" onClick={() => openConfirmDialog(f)}>Удалить</button>
			    </div>
			))

			}
	    	    </div>
{confirmDialog.isOpen && (
                <ConfirmDialog
                    message={`Вы точно хотите удалить ${confirmDialog.fileUrl.split('_').slice(1).join('_')}?`}
                    onConfirm={confirmFileDelete}
                    onCancel={closeConfirmDialog}
                />
            )}
                    <div className="admin-file-upload" style={{marginBottom: 50}}>
                        {
                            file.map((f, index) => (
                                <div className="file-upload-wrapper2">
                                    <div class="file-upload-wrapper" key={index}>
                                        <label htmlFor={`file-${index}`} class="file-upload-label">Загрузить файл.</label>
                                        <input type="file" id={`file-${index}`} name={`file-${index}`} class="file-upload-input" onChange={(e) => handleFileChange(e, index, setFile, file)} />
                                    </div>

                                    <button type="button" onClick={() => removeFileInput(index, file, setFile)} className="remove-file-button">Del</button>
                                </div>
                            ))
                        }

                        <button type="button" onClick={() => addFileInput(setFile, file)} className="add-file-button">+</button>
                    </div>
                   
                    {/* <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Порядковый номер: </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div> */}
                    
                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Датировка: </label>
                        </div>
                        <input 
                            className={errors.dating ? 'admin-form-input input-error' : 'admin-form-input'} 
                            type="text" name="dating" id="dating" 
                            onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.dating}
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Автор : </label>
                        </div>
                        <input 
                            className={errors.author ? 'admin-form-input input-error' : 'admin-form-input'} 
                            type="text" name="author" id="author" 
                            onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.author}
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Место создания:</label>
                        </div>
                        <input 
                            className={errors.place_of_creating ? 'admin-form-input input-error' : 'admin-form-input'} 
                            type="text" name="place_of_creating" id="place_of_creating" 
                            onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.place_of_creating}
                        />
                    </div>

	    	    <div className="admin-form-row">
			<div className="admin-form-row-label">
				<label htmlFor="variety">Разновидность: </label>
			    </div>
			    <select value={documentType} onChange={handleChangeDocType} className={errors.variety ? 'admin-form-input input-error' : "admin-form-select"}>
				{documentOptions.map(option => (
				    <option key={option} value={option}>{option}</option>
				))}
			    </select>
			    {documentType === 'Другое' && (
				<input
				    className={errors.variety ? 'admin-form-input input-error' : 'admin-form-input'}
				    type="text"
				    name="variety"
				    // placeholder="Введите название документа"
				    value={formDataState.variety}
				    onChange={(e) => handleChange(e, setFormData, setErrors)}
				/>
			    )}
			</div>

		<div className="admin-form-row">
		    <div className="admin-form-row-label">
			<label htmlFor="title">Адресат: </label>
		    </div>
		    <input 
			className={errors.addressee ? 'admin-form-input input-error' : 'admin-form-input'} 
			type="text" name="addressee" id="addressee" 
			onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.addressee}/>
		</div>
		
		<div className="admin-form-ckeditor">
		    <label htmlFor="brief_content">Краткое содержание: </label>
		    <div className={errors.brief_content ? "input-error" : ""}>
			<CKEditor
			    editor={ClassicEditor}
			    data={formDataState.brief_content}
			    onReady={ editor => {
				console.log("Editory is ready to use!", editor);
			    }}
			    onChange={(event, editor) => {
				const data = editor.getData();
				handleCKEditorChange("brief_content", data);
			    }}
			    name="brief_content"
			/>
		    </div>
		</div>

		    <div className="admin-form-row">
			<div className="admin-form-row-label">
			    <label htmlFor="case_prod_number">Делопроизводственный номер:</label>
			</div>
			<input 
			    className={errors.case_prod_number ? 'admin-form-input input-error' : 'admin-form-input'} 
			    type="text" name="case_prod_number" id="case_prod_number" 
			    onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.case_prod_number}/>
		    </div>
		    
		    <div className="admin-form-ckeditor">
			<label htmlFor="main_text">Основной текст: </label>
			<div className={errors.main_text ? "input-error" : ""}>
			    <CKEditor
				editor={ClassicEditor}
				data={formDataState.main_text}
				onReady={ editor => {
				    console.log("Editory is ready to use!", editor);
				}}
				onChange={(event, editor) => {
				    const data = editor.getData();
				    handleCKEditorChange("main_text", data);
				}}
				name="main_text"
			    />
			</div>
            </div>


                </div>

                <div className="admin-section-form-button">
                    <button className="admin-section-form-button-cancel delete-button-active"> Х Отмена</button>
                    <button className="admin-section-form-button-upload create-button"> + Обновить</button>
                </div>
            </form>

	</>
    )
}
