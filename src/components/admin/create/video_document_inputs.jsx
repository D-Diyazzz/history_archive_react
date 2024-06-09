import { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


export default function VideoDocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({...prev, [name]: !data}))
    }

    return (
        <>

<div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Название: </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Объем: </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>
                    
                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Количество частей:</label>
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
                            <label htmlFor="title">Учреждение (создатель):</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-ckeditor">
                        <label htmlFor="legends">Сведения о публикации:</label>
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
                    </div>
                    

                    {/* <DocumentSearchData errors={errors}/> */}
        </>
    )
}