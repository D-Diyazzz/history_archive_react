import { Navigate, Outlet, useParams } from 'react-router-dom';

import NotFoundPage from '../../components/404_not_found';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AdminNavbar from '../../components/admin/navbar';
import CDButtons from '../../components/admin/cd_buttons';
import AdminDocumentCreate from '../../components/admin/create/document_create';

import "../../style/partials/admin.css"

export default function AdminPanelCreate() {
    const {table} = useParams();
    const role = localStorage.getItem("user_role");

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
            case "docs":
                return <AdminDocumentCreate />;
            default:
                return <NotFoundPage />;
        }
    };

    return(
        <>
        
        <Header active={"Админ панель"}/>

        <main>

            <div className='admin-container'>


                <div className='admin-navbar'>
                    <AdminNavbar active={table}/>
                </div>

                <div className='admin-section'>
                   
                    {renderList()} 

                </div>
            </div>

        </main>

        <Footer/>
        
        </>
    )
}