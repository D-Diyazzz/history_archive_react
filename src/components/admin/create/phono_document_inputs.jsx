import { useState, useEffect } from "react";




export default function PhonoDocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

    const handleCKEditorChange = (name, data) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: data
        }));
        setErrors(prev => ({...prev, [name]: !data}))
    }

    const [documentGenre, setDocumentGenre] = useState('');
        const [customType, setCustomType] = useState('');

	const [documentStorageMedia, setDocumentStorageMedia] = useState('');
	const [customStorageMedia, setCustomStorageMedia] = useState("");

        const documentOptions = [
            "",
            "Выступление", "Беседа", "Репортаж", "Композиция", "Документальная радиограмма", 
            "Другое"
        ];

        const documentOptions2 = [
            "",
            "Восковой валик", "Грамофонный оригинал", "Запись на магнитной ленте", 
            "Другое"
        ];

        const handleChangeDocGenre = (event) => {
			const { value } = event.target;
			if(value === 'Другое'){
				setDocumentGenre("Другое")
				setFormData(prevFormData => ({
					...prevFormData,
					genre: ""
				}));
			}else{
				setFormData(prevFormData => ({
					...prevFormData,
					genre: value  
				}));
				setDocumentGenre(value)
			}

			setErrors(prev => ({...prev, ["genre"]: !value}))
		}

        const handleCustomInputChange = (event) => {
            setFormData(prevFormData => ({
            ...prevFormData,
            variety: e.target.value
        }));
        setErrors(prev => ({...prev, ["variety"]: !value}))

        };

		const handleChangeDocStorageMedia = (event) => {
   			const { value } = event.target;
			if(value === 'Другое'){
				setDocumentStorageMedia("Другое")
				setFormData(prevFormData => ({
					...prevFormData,
					storage_media: ""
				}));
			}else{
				setFormData(prevFormData => ({
					...prevFormData,
					storage_media: value  
				}));
				setDocumentStorageMedia(value)
			}

			setErrors(prev => ({...prev, ["storage_media"]: !value}))
     };

        const handleCustomStorageMediaInputChange = (event) => {
            setCustomStorageMedia(event.target.value);
        };


		

    return (
        <>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="genre">Жанр фонодокумента:: </label>
                        </div>
                        <select value={documentGenre} onChange={handleChangeDocGenre} className={errors.genre ? 'admin-form-input input-error' : 'admin-form-input'}>
                            {documentOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {documentGenre === 'Другое' && (
                            <input
                                className={errors.genre ? 'admin-form-input input-error' : 'admin-form-input'}
                                type="text"
								name="genre"
                                // placeholder="Введите название документа"
                                value={formDataState.genre}
                                onChange={(e) => handleChange(e, setFormData, setErrors)}
                            />
                        )}
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="brief_summary">Краткая аннотация: </label>
                        </div>
                        <input className={errors.brief_summary ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="brief_summary" id="brief_summary" onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.brief_summary}/>
                    </div>
                    
                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="addressee">Адресат:</label>
                        </div>
                        <input className={errors.addressee ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="addressee" id="addressee" onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.addressee}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="cypher">Шифр фонодокумента:</label>
                        </div>
                        <input className={errors.cypher ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="cypher" id="cypher" onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.cypher}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="lang">Язык:</label>
                        </div>
                        <input className={errors.lang ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="lang" id="lang" onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.lang}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="storage_media">Носитель информации: </label>
                        </div>
                        <select value={documentStorageMedia} onChange={handleChangeDocStorageMedia} className="admin-form-select">
                            {documentOptions2.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {documentStorageMedia === 'Другое' && (
                            <input
                                className={errors.storage_media ? 'admin-form-input input-error' : 'admin-form-input'}
                                type="text"
								name="storage_media"
                                // placeholder="Введите название документа"
                                value={formDataState.storage_media}
                                onChange={(e) => handleChange(e, setFormData, setErrors)}
                            />
                        )}
                    </div>
                    
        </>
    )
}
