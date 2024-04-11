import { Navigate, Outlet, useParams } from 'react-router-dom';

import NotFoundPage from '../../components/404_not_found';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AdminNavbar from '../../components/admin/navbar';
import CDButtons from '../../components/admin/cd_buttons';

import AdminDocumentList from '../../components/admin/list/document_list';
import AdminClassCollList from '../../components/admin/list/class_coll_list';
import AdminFormatCollList from '../../components/admin/list/format_coll_list';
import AdminMethodCollList from '../../components/admin/list/method_coll_list';

import "../../style/partials/admin.css"

export default function AdminPanelListInfo() {
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
                return <AdminDocumentList />;
            case "classes-coll":
                return <AdminClassCollList />;
            case "format-coll":
                return <AdminFormatCollList/>;
            case "method-coll":
                return <AdminMethodCollList/>;
            default:
                return null;
        }
    };

    console.log(renderList())
    if(renderList() == null){
        return(
            <NotFoundPage/>
        )
    }

    return(
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