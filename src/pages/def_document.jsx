import { useParams } from "react-router-dom"

import Header from "../components/header"
import Footer from "../components/footer"
import DefDocumentComponent from "../components/def_components/def_document_component";

import "../style/partials/def_document.css"


export default function DefDocument(){
    const {documentId} = useParams();

    return(
        <>
        <Header active={"Документ"}/>
        
        <main>
            <DefDocumentComponent documentId={documentId}/>
        </main>

        <Footer/>
        </>
    )
}