import { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


export default function VideoDocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

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
                    <label htmlFor="title">Название: </label>
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
                    <label htmlFor="volume">Объем: </label>
                </div>
                <input
                    className={errors.volume ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="volume"
                    id="volume"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.volume}
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-row-label">
                    <label htmlFor="num_of_parts">Количество частей:</label>
                </div>
                <input
                    className={errors.num_of_parts ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="num_of_parts"
                    id="num_of_parts"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.num_of_parts}
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
                    <label htmlFor="creator">Учреждение (создатель):</label>
                </div>
                <input
                    className={errors.creator ? 'admin-form-input input-error' : 'admin-form-input'}
                    type="text"
                    name="creator"
                    id="creator"
                    onChange={(e)=>handleChange(e, setFormData, setErrors)}
                    value={formDataState.creator}
                />
            </div>

            <div className="admin-form-ckeditor">
                <label htmlFor="info_of_publication">Сведения о публикации:</label>
                <div className={errors.info_of_publication ? "input-error" : ""}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={formDataState.info_of_publication}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            handleCKEditorChange("info_of_publication", data);
                        }}
                        name="info_of_publication"
                    />
                </div>
            </div>
        </>
    );
}

