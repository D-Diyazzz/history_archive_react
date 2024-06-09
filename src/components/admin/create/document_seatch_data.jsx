import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function DocumentSearchData({errors, setErrors, formDataState, setFormData, handleChange}){


    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({...prev, [name]: !data}))
    }


    return(
        <>
        <h1>Поисковые данные:</h1>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="cypher">Шифр:</label>
    </div>
    <input 
        className={errors.cypher ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="cypher" id="cypher" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.cypher}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="fund">Фонд:</label>
    </div>
    <input 
        className={errors.fund ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="fund" id="fund" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.fund}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="inventory">Опись:</label>
    </div>
    <input 
        className={errors.inventory ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="inventory" id="inventory" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.inventory}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="case">Дело:</label>
    </div>
    <input 
        className={errors.case ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="case" id="case" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.case}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="leaf">Лист:</label>
    </div>
    <input 
        className={errors.leaf ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="leaf" id="leaf" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.leaf}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="authenticity">Подлинность:</label>
    </div>
    <input 
        className={errors.authenticity ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="authenticity" id="authenticity" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.authenticity}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="lang">Язык:</label>
    </div>
    <input 
        className={errors.lang ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="lang" id="lang" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.lang}/>
</div>

<div className="admin-form-row">
    <div className="admin-form-row-label">
        <label htmlFor="playback_method">Способ воспроизведения:</label>
    </div>
    <input 
        className={errors.playback_method ? 'admin-form-input input-error' : 'admin-form-input'} 
        type="text" name="playback_method" id="playback_method" 
        onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.playback_method}/>
</div>

<div className="admin-form-ckeditor">
    <label htmlFor="other">Другое: </label>
    <div className={errors.other ? "input-error" : ""}>
        <CKEditor
            editor={ClassicEditor}
            data={formDataState.legends}
            onReady={ editor => {
                console.log("Editory is ready to use!", editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                handleCKEditorChange("other", data);
            }}
            name="other"
        />
    </div>
</div>
</>
    )
}