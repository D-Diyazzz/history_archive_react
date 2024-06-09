import { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import DocumentSearchData from "./document_seatch_data";

export default function PhotoDocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

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
        setDocumentType(value);
        if (value !== 'Другое') {
            setCustomType(''); // Очищаем пользовательский ввод, если не выбрано "Другое"
        }
    };

    const handleCustomInputChange = (event) => {
        setCustomType(event.target.value);
    };

    return (
        <>

<div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Название документа (краткая аннотация): </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Подлинность / оригинальность: </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>
                    
                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Степень полноты воспроизведения:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Носитель информации:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Цветность:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Размер оригинала:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Масштаб изображения:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>
                    

                    {/* <DocumentSearchData errors={errors}/> */}
        </>
    )
}