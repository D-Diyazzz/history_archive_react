export default function AdminDocumentCreate(){

    return(
        // <div className="admin-section-create">
        <>
            <p className="admin-title-text">Загрузить документ</p>
            <form className="admin-section-create-form">
                <div className="admin-section-form-inputs">
                    <label htmlFor="title">Название: </label>
                    <input className="admin-form-input" type="text" name="title" id="title"/>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="heading">Заголовок: </label>
                            <input className="admin-form-input" type="text" name="heading" id="heading"/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="author">Автор: </label>
                            <input className="admin-form-input" type="text" name="author" id="author"/>
                        </div>
                    </div>
                    <label htmlFor="description_content">Описание содержания: </label>
                    <textarea className="admin-form-input" name="description_content" id="description_content" rows="4"></textarea>

                    <label htmlFor="legends">Легенды: </label>
                    <textarea className="admin-form-input" name="legends" id="legends" rows="4"></textarea>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="dating">Датировка: </label>
                            <input className="admin-form-input" type="text" name="dating" id="dating"/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="format_doc">Формат документа: </label>
                            <input className="admin-form-input" type="text" name="format_doc" id="format_doc"/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="color_palette">Цветовая палитра: </label>
                            <input className="admin-form-input" type="text" name="color_palette" id="color_palette"/>
                        </div>
                    </div>

                    <div className="admin-form-input-group">
                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="resolution">Разрешение: </label>
                            <input className="admin-form-input" type="text" name="resolution" id="resolution"/>
                        </div>

                        <div className="admin-form-input-l-i" style={{"margin-right":"10px"}}>
                            <label htmlFor="compression">Сжатие: </label>
                            <input className="admin-form-input" type="text" name="compression" id="compression"/>
                        </div>

                        <div className="admin-form-input-l-i">
                            <label htmlFor="scanner_model">Модель сканера: </label>
                            <input className="admin-form-input" type="text" name="scanner_model" id="scanner_model"/>
                        </div>
                    </div>
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