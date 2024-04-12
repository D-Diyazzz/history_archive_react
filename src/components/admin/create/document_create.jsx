import api from "../../../api";

export default function AdminDocumentCreate(){

    const [formDataState, setFormData] = useState({
        title: "",
        headig: "",
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(formDataState).forEach(key => {
            formData.append(key, formDataState[key]);
        })

        if (file) {
            formData.append("file", file);
        }

        try{
            const resзonse = await api.post("/document", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(resзonse.data)
        } catch (error){
            console.log(error);
        }
    }

    return(
        // <div className="admin-section-create">
        <>
            <p className="admin-title-text">Загрузить документ</p>
            <form className="admin-section-create-form" onSubmit={handleSubmit}>
                <div className="admin-section-form-inputs">
                    <label htmlFor="documentFile">Загрузить файл:</label>
                    <input type="file" id="documentFile" name="documentFile" onChange={handleFileChange} />

                    <label htmlFor="title">Название: </label>
                    <input className="admin-form-input" type="text" name="title" id="title" onChange={handleChange} value={formData.title}/>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="heading">Заголовок: </label>
                            <input className="admin-form-input" type="text" name="heading" id="heading" onChange={handleChange} value={formData.headig}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="author">Автор: </label>
                            <input className="admin-form-input" type="text" name="author" id="author" onChange={handleChange} value={formData.author}/>
                        </div>
                    </div>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="dating">Датировка: </label>
                            <input className="admin-form-input" type="text" name="dating" id="dating" onChange={handleChange} value={formData.dating}/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="format_doc">Формат документа: </label>
                            <input className="admin-form-input" type="text" name="format_doc" id="format_doc" onChange={handleChange} value={formData.format_doc}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="color_palette">Цветовая палитра: </label>
                            <input className="admin-form-input" type="text" name="color_palette" id="color_palette" onChange={handleChange} value={formData.color_palette}/>
                        </div>
                    </div>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="resolution">Разрешение: </label>
                            <input className="admin-form-input" type="text" name="resolution" id="resolution" onChange={handleChange} value={formData.resolution}/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="compression">Сжатие: </label>
                            <input className="admin-form-input" type="text" name="compression" id="compression" onChange={handleChange} value={formData.compression}/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="scanner_model">Модель сканера: </label>
                            <input className="admin-form-input" type="text" name="scanner_model" id="scanner_model" onChange={handleChange} value={formData.scanner_model}/>
                        </div>
                    </div>

                    <label htmlFor="description_content">Описание содержания: </label>
                    <textarea className="admin-form-input" name="description_content" id="description_content" rows="4" onChange={handleChange} value={formData.description_content}></textarea>

                    <label htmlFor="legends">Легенды: </label>
                    <textarea className="admin-form-input" name="legends" id="legends" rows="4" onChange={handleChange} value={formData.legends}></textarea>
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