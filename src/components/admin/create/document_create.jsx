import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); 
    }

    useEffect(() => {
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError(true); 
                setFile(null)
            } else {
                setFileError(false);
            }
        }
    }, [file]);

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
        if (file === null){
            alert('Файл не выбран или выбран файл неправильного формата')
            setFileError(true);
            return
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

            // navigate(`/admin/docs/${response.id}`)
        } catch (error){
            console.log("error", error);
        }
    }

    return(
        // <div className="admin-section-create">
        <>
            <p className="admin-title-text">Загрузить документ</p>
            <form className="admin-section-create-form" onSubmit={handleSubmit}>
                <div className="admin-section-form-inputs">
                    <label htmlFor="file">Загрузить файл:</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} />
                    {fileError ? (
                        <p style={{"color": "red", "fontSize": "16px", "marginBottom": "0", "marginTop": "5px"}}>PDF, PNG, DOCS</p>
                    ) : (
                        <></>
                    )}

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

                    <label htmlFor="description_content">Описание содержания: </label>
                    <textarea className={errors.description_content ? 'admin-form-input input-error' : 'admin-form-input'} name="description_content" id="description_content" rows="4" onChange={handleChange} value={formDataState.description_content}></textarea>

                    <label htmlFor="legends">Легенды: </label>
                    <textarea className={errors.legends ? 'admin-form-input input-error' : 'admin-form-input'} name="legends" id="legends" rows="4" onChange={handleChange} value={formDataState.legends}></textarea>
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