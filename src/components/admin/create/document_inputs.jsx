import { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import DocumentSearchData from "./document_seatch_data";

export default function DocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

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

    return (
        <>
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

            {/* <DocumentSearchData errors={errors}/> */}
        </>
    )
}