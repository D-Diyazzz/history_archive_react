import { useState, useEffect } from "react";




export default function PhonoDocumentInputs({errors, setErrors, formDataState, setFormData, handleChange}){

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
            "Выступление", "Беседа", "Репортаж", "Композиция", "Документальная радиограмма", 
            "Другое"
        ];

        const documentOptions2 = [
            "",
            "Восковой валик", "Грамофонный оригинал", "Запись на магнитной ленте", 
            "Другое"
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
                            <label htmlFor="title">Жанр фонодокумента:: </label>
                        </div>
                        <select value={documentType} onChange={handleChangeDocType} className="admin-form-select">
                            {documentOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {documentType === 'Другое' && (
                            <input
                                className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'}
                                type="text"
                                // placeholder="Введите название документа"
                                value={customType}
                                onChange={handleCustomInputChange}
                            />
                        )}
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Краткая аннотация: </label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>
                    
                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Адресат:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Шифр фонодокумента:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Язык:</label>
                        </div>
                        <input className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} type="text" name="title" id="title" onChange={handleChange} value={formDataState.title}/>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-row-label">
                            <label htmlFor="title">Носитель информации: </label>
                        </div>
                        <select value={documentType} onChange={handleChangeDocType} className="admin-form-select">
                            {documentOptions2.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {documentType === 'Другое' && (
                            <input
                                className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'}
                                type="text"
                                // placeholder="Введите название документа"
                                value={customType}
                                onChange={handleCustomInputChange}
                            />
                        )}
                    </div>
                    
        </>
    )
}