import Header from "../components/header";
import Footer from "../components/footer";

import book_img from "../style/images/books.png"
import kaz_map_book from "../style/images/kaz-map-book.png"
import book_list from "../style/images/book-list-crop.png"

import "../style/partials/home.css"

export default function Home(){
//     return (
//         <>
//             <Header active={"Главная"}/>
            
//             <main>
//                 <div className="explanation-project-content">
//                     <div className="explanation-project-name">
//                         <img src={book_img}/>
//                         <p>E-Doc Complex</p>
//                         <img src={kaz_map_book}/>
//                     </div>

//                     <div className="explanation-project-text">
//                         <p>Веб-сайт "E-Doc Complex" дает возможность  создавать  типы электронных документальных публикаций  архивных  материалов  исходя из целевого назначения: научный, научно- популярный и учебный, а также тематические виртуальные выставки</p>
//                     </div>
//                 </div>

//                 <div className="choose-doc-collection">
//                     <div className="choose-doc-collection-text">
//                         <p>Виды сборников</p>
//                     </div>

//                     <div className="choose-doc-collection-list-block">
//                         <div className="choose-doc-collection-list">
//                             <a href="#"><img src={book_list}/></a>
//                             <a href="#">Научные сборники</a>
//                         </div>

//                         <div className="choose-doc-collection-list">
//                             <a href="#"><img src={book_list}/></a>
//                             <a href="#">Научно-популярные сборники</a>
//                         </div>

//                         <div className="choose-doc-collection-list">
//                             <a href="#"><img src={book_list}/></a>
//                             <a href="#">Учебные сборники</a>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="exhibitions">

//                     <div className="exhibitions-text">
//                         <p>Онлайн выставки</p>
//                     </div>

//                 </div>
//             </main>
//             <Footer/>
//         </>
//     )

return (
    <>
        <Header active={"main"}/>
        
        <main>
            <div className="explanation-project-content">
                <div className="explanation-project-name">
                    <img src={book_img}/>
                    <p>E-Doc Complex</p>
                    <img src={kaz_map_book}/>
                </div>

                <div className="explanation-project-text">
                    <p>The E-Doc Complex website makes it possible to create types of electronic documentary publications of archival materials based on the intended purpose: scientific, popular science and educational, as well as thematic virtual exhibitions</p>
                </div>
            </div>

            <div className="choose-doc-collection">
                <div className="choose-doc-collection-text">
                    <p>Types of collections</p>
                </div>

                <div className="choose-doc-collection-list-block">
                    <div className="choose-doc-collection-list">
                        <a href="#"><img src={book_list}/></a>
                        <a href="#">Scientific collections</a>
                    </div>

                    <div className="choose-doc-collection-list">
                        <a href="#"><img src={book_list}/></a>
                        <a href="#">Popular science collections</a>
                    </div>

                    <div className="choose-doc-collection-list">
                        <a href="#"><img src={book_list}/></a>
                        <a href="#">Educational collections</a>
                    </div>
                </div>
            </div>

            <div className="exhibitions">

                <div className="exhibitions-text">
                    <p>Online exhibitions</p>
                </div>

            </div>
        </main>
        <Footer/>
    </>
)

}
