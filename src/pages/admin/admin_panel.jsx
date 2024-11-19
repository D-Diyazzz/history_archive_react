import { Navigate, Outlet, useParams } from 'react-router-dom';

import NotFoundPage from '../404_not_found';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AdminNavbar from '../../components/admin/navbar';
import CDButtons from '../../components/admin/cd_buttons';

import "../../style/partials/admin.css"

export default function AdminPanel() {
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

    return(
        <>
        
        <Header active={"Админ панель"}/>

        <main>

            <div className='admin-container'>


                <div className='admin-navbar'>
                    <AdminNavbar role={role}/>
                </div>

                <div className='admin-section'>
                    
                    <p className='admin-greeting-text'>Добро пожаловать в Админ панель</p>

                </div>
            </div>

        </main>

        <Footer/>
        
        </>
    )
}
