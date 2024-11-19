import {Navigate, useParams} from 'react-router-dom';

import NotFoundPage from '../404_not_found';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AdminNavbar from '../../components/admin/navbar';
import CDButtons from '../../components/admin/cd_buttons';
import AdminDocumentUpdateComponent from '../../components/admin/update/document_update';

import "../../style/partials/admin.css"
import AdminCollectionCreate from '../../components/admin/create/collection_create';


export default function AdminPanelUpdate() {
    const {table, id} = useParams();
    const role = localStorage.getItem("user_role");

    if(role === null){
	return(
	   <Navigate to="/login"/>
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
                return <AdminDocumentUpdateComponent id={id} />;
			case "collection":
				return <AdminCollectionCreate id={id} />;
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
	    <Header active={"Админ панель"}/>
	    
	    <main>
        	<div className='admin-container'>
	    	    <div className='admin-navbar'>
	    		<AdminNavbar active={table} role={role}/>
	            </div>

	    	    <div className='admin-section'>
	    		{renderList()}
	    	    </div>
	    	</div>
	    </main>

	    <Footer />
	</>
    )
}
