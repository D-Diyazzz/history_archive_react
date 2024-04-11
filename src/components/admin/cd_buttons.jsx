export default function CDButtons({link}){
    return(
        <div className="create-delete-buttons-container">
            <a href={link} className="create-button"> + Добавить</a>
            {/* <button className="delete-button"> - Удалить</button> */}
        </div>
    )
}