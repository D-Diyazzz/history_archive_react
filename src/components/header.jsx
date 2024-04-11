import iconsImg from '../style/images/earth.png'
import user_icon from '../style/images/user_icon.png'

import '../style/partials/header.css'

export default function Header({active}) {
    var name = localStorage.getItem('user_name');

    if (name && name.length > 5) {
        name = name.slice(0, 5) + "..."; 
    }

    return(
        <>
            <header>
                <div className="logo">
                    {/* <img src="img/logo.png"/> */}
                    E-Doc Complex
                </div>

                <div className="nav-bar">
                    <div className="nav-bar-left">
                        <a href="/collection" className='nav-bar-menu'>Сборники</a>
                        <a href="/document" className='nav-bar-menu'>Документы</a>
                        <a href="#" className='nav-bar-menu'>Выставки</a>
                    </div>

                    <div class="nav-bar-select-page">
                        <p className="active">{active}</p>
                    </div>

                    <div className="nav-bar-right">
                        <a href="/" className='nav-bar-menu'>Главная</a>
                        <a href="#" className='nav-bar-menu'>Уведомления</a>
                    </div>
                </div>  

                <div className="icons">
                    <div className="icons-list">
                        <img src={iconsImg}/>
                        <p>RU</p>
                    </div>
                    <div className="icons-list">
                        <img src={user_icon}/>
                        {name ? (
                            <a href="#">{name}</a>
                        ) : (
                            <a href="/login">Log In</a>
                        )}
                    </div>
                </div>
            </header>

            <hr class="hr-header"/>
            <hr class="hr-header"/>
        </>
    )
    // return(
    //     <>
    //         <header>
    //             <div className="logo">
    //                 {/* <img src="img/logo.png"/> */}
    //                 E-Doc Complex
    //             </div>

    //             <div className="nav-bar">
    //                 <div className="nav-bar-left">
    //                     <a href="/collection" className='nav-bar-menu'>Collections</a>
    //                     <a href="/document" className='nav-bar-menu'>Documents</a>
    //                     <a href="#" className='nav-bar-menu'>Exhibitions</a>
    //                 </div>

    //                 <div class="nav-bar-select-page">
    //                     <p className="active">{active}</p>
    //                 </div>

    //                 <div className="nav-bar-right">
    //                     <a href="/" className='nav-bar-menu'>Main</a>
    //                     <a href="#" className='nav-bar-menu'>Notifications</a>
    //                 </div>
    //             </div>  

    //             <div className="icons">
    //                 <div className="icons-list">
    //                     <img src={iconsImg}/>
    //                     <p>ENG</p>
    //                 </div>
    //                 <div className="icons-list">
    //                     <img src={user_icon}/>
    //                     {name ? (
    //                         <a href="#">{name}</a>
    //                     ) : (
    //                         <a href="/login">Log In</a>
    //                     )}
    //                 </div>
    //             </div>
    //         </header>

    //         <hr class="hr-header"/>
    //         <hr class="hr-header"/>
    //     </>
    // )
}