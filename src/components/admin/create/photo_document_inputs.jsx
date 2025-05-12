import { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import DocumentSearchData from "./document_seatch_data";

export default function PhotoDocumentInputs({ errors, setErrors, formDataState, setFormData, handleChange }) {
    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({ ...prev, [name]: !data }));
    };

    return (
        <>
            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="title">Название документа (краткая аннотация):</label>
                </div>
                <input
                    className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="title"
                    id="title"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.title}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="completeness_of_reproduction">Степень полноты воспроизведения:</label>
                </div>
                <input
                    className={errors.completeness_of_reproduction ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="completeness_of_reproduction"
                    id="completeness_of_reproduction"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.completeness_of_reproduction}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="storage_media">Носитель информации:</label>
                </div>
                <input
                    className={errors.storage_media ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="storage_media"
                    id="storage_media"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.storage_media}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="color">Цветность:</label>
                </div>
                <input
                    className={errors.color ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="color"
                    id="color"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.color}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="size_of_original">Размер оригинала:</label>
                </div>
                <input
                    className={errors.size_of_original ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="size_of_original"
                    id="size_of_original"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.size_of_original}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="image_scale">Масштаб изображения:</label>
                </div>
                <input
                    className={errors.image_scale ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="image_scale"
                    id="image_scale"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.image_scale}
                />
            </div>
        </>
    );
}

