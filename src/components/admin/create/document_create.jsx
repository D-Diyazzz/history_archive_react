import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import api from "../../../api";

export default function AdminDocumentCreate(){
    const navigate = useNavigate();
    const [formDataState, setFormData] = useState({
        title: "",
        heading: "",
        author: "",
        description_content: "",
        legends: "",
        dating: "",
        format_doc: "",
        color_palette: "",
        resolution: "",
        compression: "",
        scanner_model: ""
    });

    const [file, setFile] = useState([]);
    const [fileError, setFileError] = useState();
    const [errors, setErrors] = useState({
        title: false,
        heading: false,
        author: false,
        description_content: false,
        legends: false,
        dating: false,
        format_doc: false,
        color_palette: false,
        resolution: false,
        compression: false,
        scanner_model: false
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

    useEffect(() => {
        const fileLabels = document.querySelectorAll('.file-upload-label');
        const fileWrappers = document.querySelectorAll('.file-upload-wrapper');
        const newFileErrors = file.map((singleFile, index) => {
            if (singleFile && singleFile.type !== "application/pdf") {
                const fileLabel = fileLabels[index]
                const fileWrapper = fileWrappers[index]
                fileLabel.textContent = "PDF, PNG, DOCS";
                fileLabel.style.color = "red";
                fileWrapper.style.border = "2px dashed red";
                return true; 
            }
            return false; // Нет ошибки
        });
        setFileError(newFileErrors.some(error => error === true));
    }, [file]);

    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({...prev, [name]: !data}))
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prev => ({...prev, [name]: !value}))
    }

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formDataState).forEach(key => {
            if(!formDataState[key]){
                newErrors[key] = true
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()){
            alert('Заполните все поля!')
            return;
        }

        if (!file.length || fileError === true) {
            alert('Файл не выбран или выбран файл неправильного формата');
            // setFileError(file.map(f => f === null || f.type !== "application/pdf")); 
            return;
        }

        const formData = new FormData();
        const requestaData = new FormData();

        Object.keys(formDataState).forEach(key => {
            formData.append(key, formDataState[key]);
        })

        requestaData.append("file", file);
        requestaData.append("data", JSON.stringify(formDataState))
        console.log(requestaData)
        try{
            const response = await api.post("/document", requestaData);
            navigate(`/admin/document/${response.data.id}`)
        } catch (error){
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

    return(
        // <div className="admin-section-create">
        <>
            <p className="admin-title-text">Загрузить документ</p>
            <form className="admin-section-create-form" onSubmit={handleSubmit}>
                <div className="admin-section-form-inputs">
                    <div className="admin-file-upload">
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
                   

                    <label htmlFor="title">Название: </label>
                    <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="heading">Заголовок: </label>
                            <input className={errors.heading ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="heading" id="heading" onChange={handleChange} value={formDataState.heading}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="author">Автор: </label>
                            <input className={errors.author ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="author" id="author" onChange={handleChange} value={formDataState.author}/>
                        </div>
                    </div>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="dating">Датировка: </label>
                            <input className={errors.dating ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="dating" id="dating" onChange={handleChange} value={formDataState.dating}/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="format_doc">Формат документа: </label>
                            <input className={errors.format_doc ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="format_doc" id="format_doc" onChange={handleChange} value={formDataState.format_doc}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="color_palette">Цветовая палитра: </label>
                            <input className={errors.color_palette ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="color_palette" id="color_palette" onChange={handleChange} value={formDataState.color_palette}/>
                        </div>
                    </div>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="resolution">Разрешение: </label>
                            <input className={errors.resolution ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="resolution" id="resolution" onChange={handleChange} value={formDataState.resolution}/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="compression">Сжатие: </label>
                            <input className={errors.compression ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="compression" id="compression" onChange={handleChange} value={formDataState.compression}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="scanner_model">Модель сканера: </label>
                            <input className={errors.scanner_model ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="scanner_model" id="scanner_model" onChange={handleChange} value={formDataState.scanner_model}/>
                        </div>
                    </div>

                    <label htmlFor="legends">Легенды: </label>
                    <div className={errors.legends ? "input-error" : ""}>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formDataState.legends}
                            onReady={ editor => {
                                console.log("Editory is ready to use!", editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                handleCKEditorChange("legends", data);
                            }}
                            name="legends"
                        />
                    </div>

                    <label htmlFor="description_content">Описание содержания: </label>
                    <div className={errors.legends ? "input-error" : ""}>
                        <CKEditor
                            editor={ClassicEditor}
                            // config={{
                            // }}
                            data={formDataState.description_content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                handleCKEditorChange("description_content", data);
                            }}
                            name="description_content"
                        />
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