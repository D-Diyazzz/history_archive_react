import { Navigate, Outlet, useParams } from 'react-router-dom';

import NotFoundPage from '../404_not_found';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AdminNavbar from '../../components/admin/navbar';
import CDButtons from '../../components/admin/cd_buttons';

import AdminDocumentList from '../../components/admin/list/document_list';


import "../../style/partials/admin.css"
import { Page } from 'react-pdf';
import AdminCollectionList from '../../components/admin/list/collection_list';
import CreateCollectionButtons from '../../components/admin/create_collection_button';
import AdminUserList from '../../components/admin/list/user_list';

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

	const renderButtonCreate = () => {
		if(role === "AdminUser" || role === "SuperAdminUser"){
			switch(table) {
				case "collection":
					return <CreateCollectionButtons />;
				default:
					return <CDButtons link={`/admin/${table}/create`}/>
			}

		}else{
			return(<></>)
		}
	}

    const renderList = () => {
        switch(table) {
            case "document":
                return <AdminDocumentList />;
			case "collection":
				return <AdminCollectionList/>;
			case "user":
				return <AdminUserList />;
            default:
                return null;
        }
    };

    if(renderList() == null){
        return(
            <NotFoundPage/>
        )
    }

    return(
        <>
        
        <Header active="admin"/>

        <main>

            <div className='admin-container'>


                <div className='admin-navbar'>
                    <AdminNavbar active={table} role={role}/>
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
