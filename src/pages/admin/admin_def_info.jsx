import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import Header from "../../components/header";
import Footer from "../../components/footer";
import CDButtons from "../../components/admin/cd_buttons";
import NotFoundPage from "../404_not_found";
import AdminNavbar from "../../components/admin/navbar";
import DefDocumentComponent from "../../components/def_components/def_document_component";
import api from "../../api";
import DefCollectionComponent from "../../components/def_components/def_collection_component";
import CreateCollectionButtons from "../../components/admin/create_collection_button";
import AdminDefCollectionComponent from "../../components/admin/def_components/def_admin_collection_component";


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
			case "collection":
				return <AdminDefCollectionComponent collectionId={id}/>
            default:
                return null;
        }
    }    

	const renderButtonCreate = () => {
		switch(table) {
			case "collection":
				return <CreateCollectionButtons/>
			default:
				return <CDButtons link={`/admin/${table}/create`}/>
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

					{renderButtonCreate()}

                    {renderList()} 

                </div>
            </div>
        </main>

        <Footer/>
        </>
    )

}
