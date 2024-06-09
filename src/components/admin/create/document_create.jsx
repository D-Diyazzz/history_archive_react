import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DocumentInputs from "./document_inputs";
import PhotoDocumentInputs from "./photo_document_inputs";
import VideoDocumentInputs from "./video_document_inputs";
import PhonoDocumentInputs from "./phono_document_inputs";
import DocumentSearchData from "./document_seatch_data";

import api from "../../../api";

export default function AdminDocumentCreate(){
    const navigate = useNavigate();
    const [formDataState, setFormData] = useState({
        author: "",
        dating: "",
        place_of_creating: ""
    });
    const [DocumentFormData, setDocumentFormData] = useState({
        variety: "",
        addressee: "",
        brief_content: "",
        case_prod_number: "",
        main_text: ""
    })
    const [PhotoDocFormData, setPhotoDocFormData] = useState({
        title: "",
        completeness_of_reproduction: "",
        storage_media: "",
        color: "",
        size_of_original: "",
        image_scale: ""
    })
    const [VideoDocFormData, setVideoDocFormData] = useState({
        title: "",
        volume: "",
        num_of_parts: "",
        color: "",
        creator: "",
        info_of_publication: ""
    })
    const [PhonoDocFormData, setPhonoDocFormData] = useState({
        genre: "",
        brief_summary: "",
        addressee: "",
        cypher: "",
        lang: "",
        storage_media: ""
    })
    const [SearchDataForm, setSearchDataForm] = useState({
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
        place_of_creating: false
    });
    const [DocumentFormErrors, setDocumentFormErrors] = useState({
        variety: false,
        addressee: false,
        brief_content: false,
        case_prod_number: false,
        main_text: false
    });
    const [PhotoDocFormErrors, setPhotoDocFormErrors] = useState({
        title: false,
        completeness_of_reproduction: false,
        storage_media: false,
        color: false,
        size_of_original: false,
        image_scale: false
    });
    const [VideoDocFormErrors, setVideoDocFormErrors] = useState({
        title: false,
        volume: false,
        num_of_parts: false,
        color: false,
        creator: false,
        info_of_publication: false
    });
    const [PhonoDocFormErrors, setPhonoDocFormErrors] = useState({
        genre: false,
        brief_summary: false,
        addressee: false,
        cypher: false,
        lang: false,
        storage_media: false
    });
    const [SearchDataFormErrors, setSearchDataFormErrors] = useState({
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

    const handleFileChange = (e, index) => {
        const files = [...file];
        const target_file = e.target.files[0];
        const fileLabels = document.querySelectorAll('.file-upload-label');
        const fileWrappers = document.querySelectorAll('.file-upload-wrapper');
        const fileLabel = fileLabels[index]
        const fileWrapper = fileWrappers[index]

        if(target_file){
            fileLabel.textContent = `Выбран файл: ${target_file.name}`;
            fileLabel.style.color = "black";
            fileWrapper.style.border = "2px dashed #333";
            files[index] = target_file;
            setFile(files);
        } else{
            fileLabel.textContent = "Загрузить файл:";
            // setFile(null);
        }
    }

    const allowed_formats = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg", "image/webp", "image/jpg"]

    useEffect(() => {
        const fileLabels = document.querySelectorAll('.file-upload-label');
        const fileWrappers = document.querySelectorAll('.file-upload-wrapper');
        const newFileErrors = file.map((singleFile, index) => {
            if (singleFile && !allowed_formats.includes(singleFile.type)) {
                const fileLabel = fileLabels[index]
                const fileWrapper = fileWrappers[index]
                fileLabel.textContent = "PDF, PNG, DOCS, JPEG, JPG WEBP";
                fileLabel.style.color = "red";
                fileWrapper.style.border = "2px dashed red";
                return true; 
            }
            return false; // Нет ошибки
        });
        setFileError(newFileErrors.some(error => error === true));
    }, [file]);

    const handleChange = (e, setTarget, setTargetErrors) => {
        const {name, value} = e.target;
        setTarget(prevState => ({
            ...prevState,
            [name]: value
        }));
        setTargetErrors(prev => ({...prev, [name]: !value}))
    }

    const validateForm = (target, setTargetErrors) => {
        const newErrors = {};
        Object.keys(target).forEach(key => {
            if(!target[key]){
                newErrors[key] = true
            }
        });
        setTargetErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validate_main_data = validateForm(formDataState, setErrors);

        switch (currentComponent) {
            case 'document':
                const validate_doc_data = validateForm(DocumentFormData, setDocumentFormErrors);
                const validate_search_data = validateForm(SearchDataForm, setSearchDataFormErrors);
                if(!validate_main_data || !validate_doc_data || !validate_search_data){
                    alert('Заполните все поля!')
                    return
                }
        }

        if (!file.length || fileError === true) {
            alert('Файл не выбран или выбран файл неправильного формата');
            return;
        }

	const formData = new FormData();
	const requestaData = new FormData();

	file.forEach(singleFile => {
	    requestaData.append("files", singleFile);
	});

	Object.keys(formDataState).forEach(key => {
	    formData.append(key, formDataState[key]);
	});

	switch (currentComponent) {
	    case 'document':
		Object.keys(DocumentFormData).forEach(key => {
		    formData.append(key, DocumentFormData[key]);
		});
		
		Object.keys(SearchDataForm).forEach(key => {
		    formData.append(`search_data[${key}]`, SearchDataForm[key]);
		});
	}

	// Create an object to hold all formData entries
	let dataObject = {};
	formData.forEach((value, key) => {
	    if (key.startsWith('search_data[')) {
		// Extract the nested key from the bracket notation
		let nestedKey = key.match(/search_data\[(.*)\]/)[1];
		if (!dataObject['search_data']) {
		    dataObject['search_data'] = {};
		}
		dataObject['search_data'][nestedKey] = value;
	    } else {
		dataObject[key] = value;
	    }
	});

	// Append the data object as a JSON string to requestaData under the key 'data'
	requestaData.append("data", JSON.stringify(dataObject));

	console.log(requestaData);

	try{
            const response = await api.post("/document", requestaData);
            console.log(response)
	    navigate(`/admin/document/${response.data.id}`) 
        } catch (error){
	    console.log(error)
            console.log("error", error);
        }
    }

    const addFileInput = () => {
        setFile([...file, null])
    };

    const removeFileInput = (index) => {
        const newFiles = [...file];
        newFiles.splice(index, 1);
        setFile(newFiles);

    }

    const [currentComponent, setCurrentComponent] = useState('document');

    const handleComponentSwitch = (component) => {
        setCurrentComponent(component);
    };

    const renderComponent = () => {
        switch (currentComponent) {
            case 'document':
                return <DocumentInputs errors={DocumentFormErrors} setErrors={setDocumentFormErrors} formDataState={DocumentFormData} setFormData={setDocumentFormData} handleChange={handleChange}/>;
            case 'photo':
                return <PhotoDocumentInputs errors={PhotoDocFormErrors} formDataState={PhotoDocFormData} handleChange={handleChange}/>;
            case 'video':
                return <VideoDocumentInputs errors={VideoDocFormErrors} formDataState={VideoDocFormData} handleChange={handleChange}/>;
            case 'phono':
                return <PhonoDocumentInputs errors={PhonoDocFormErrors} formDataState={PhonoDocFormData} handleChange={handleChange}/>;
            default:
                return null;
        }
    };

    const isActive = (componentName) => {
        return currentComponent === componentName ? 'doc-type-button-active' : 'doc-type-button';
    };


    return(
        // <div className="admin-section-create">
        <>
            <p className="admin-title-text">Загрузить документ</p>
            <form className="admin-section-create-form" onSubmit={handleSubmit}>
                <div className="admin-section-form-inputs">
                    <div className="admin-file-upload" style={{marginBottom: 50}}>
                        {
                            file.map((file, index) => (
                                <div className="file-upload-wrapper2">
                                    <div class="file-upload-wrapper" key={index}>
                                        <label htmlFor={`file-${index}`} class="file-upload-label">Загрузить файл:</label>
                                        <input type="file" id={`file-${index}`} name={`file-${index}`} class="file-upload-input" onChange={(e) => handleFileChange(e, index)} />
                                    </div>

                                    <button type="button" onClick={() => removeFileInput(index)} className="remove-file-button">Del</button>
                                </div>
                            ))
                        }

                        <button type="button" onClick={addFileInput} className="add-file-button">+</button>
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

                    {/* <DocumentInputs errors={errors} formDataState={formDataState} handleChange={handleChange}/> */}
                    <div className="admin-form-doc-type">
                        <button type="button" className={isActive('document')} onClick={() => handleComponentSwitch('document')}>Документ</button>
                        <button type="button" className={isActive('photo')} onClick={() => handleComponentSwitch('photo')}>Фотодокументы</button>
                        <button type="button" className={isActive('video')} onClick={() => handleComponentSwitch('video')}>Кино, видеокадр</button>
                        <button type="button" className={isActive('phono')} onClick={() => handleComponentSwitch('phono')}>Фонодокументы</button>
                    </div>
                    
                    <div className="admin-section-type-doc">
                    {renderComponent()}
                    
                    {currentComponent !== "phono" ?
                    <DocumentSearchData errors={SearchDataFormErrors} setErrors={setSearchDataFormErrors} formDataState={SearchDataForm} setFormData={setSearchDataForm} handleChange={handleChange}/>
                    : <></>
                    }   
                    </div>

                </div>

                <div className="admin-section-form-button">
                    <button className="admin-section-form-button-cancel delete-button-active"> Х Отмена</button>
                    <button className="admin-section-form-button-upload create-button"> + Загрузить</button>
                </div>
            </form>
        </>
        // {/* </div> */}
    )

}
