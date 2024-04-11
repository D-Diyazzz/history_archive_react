import Header from "./header"

import "../style/partials/404_not_found.css"


export default function NotFoundPage(){
    return(
        <>
            <Header active={"404"}/>

            <div className="not-found">
                <h1>404</h1>
                <p>Page Not Found</p>
            </div>
        </>
    )
}