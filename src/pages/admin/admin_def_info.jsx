import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import Header from "../../components/header";
import Footer from "../../components/footer";
import CDButtons from "../../components/admin/cd_buttons";
import NotFoundPage from "../404_not_found";
import AdminNavbar from "../../components/admin/navbar";
import DefDocumentComponent from "../../components/def_components/def_document_component";
import api from "../../api";


export default function AdminPanleDefInfo(){
    const {table, id} = useParams();
    const role = localStorage.getItem("user_role");
    const [data, setData] = useState(null);

    if(role === null){
        return(
            <Navigate to="/login" />
        )
    }
    if(role === "BasicUser"){
        return(
            <NotFoundPage/>
        )
    }

    const renderList = () => {
        
        switch(table) {
            case "document":
                return <DefDocumentComponent documentId={id}/>
            default:
                return null;
        }
    }    

    if(renderList() == null){
        return(
            <NotFoundPage/>
        )
    }
    return (
        <>
        
        <Header active={"Админ панель"}/>
        
        <main>
            <div className='admin-container'>


                <div className='admin-navbar'>
                    <AdminNavbar active={table}/>
                </div>

                <div className='admin-section'>

                    <CDButtons link={`/admin/${table}/create`}/>

                    {renderList()} 

                </div>
            </div>
        </main>

        <Footer/>
        </>
    )

}