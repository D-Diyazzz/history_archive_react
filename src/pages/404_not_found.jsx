import Header from "../components/header"
import NotFoundComponent from "../components/404_not_found_component"


export default function NotFoundPage(){
    return(
        <>
            <Header active={"404"}/>

            <NotFoundComponent/>
        </>
    )
}