import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Main from "./pages/Main";
import Register from "./pages/register";
import LogOut from "./pages/logout";
import Collection from "./pages/collectoins";
import Documents from "./pages/documets";
import DefDocument from "./pages/def_document";
import NotFoundPage from "./pages/404_not_found";

import AdminPanel from "./pages/admin/admin_panel";
import AdminPanelListInfo from "./pages/admin/admin_list_info";
import AdminPanelCreate from "./pages/admin/admin_create";
import AdminPanleDefInfo from "./pages/admin/admin_def_info";
import AdminPanelUpdate from "./pages/admin/admin_update";
import AdminPanelCommentColl from "./pages/admin/admin_comment_coll";
import DefCollection from "./pages/def_collection";
import DefPhonoDocumentPage from "./pages/def_phono_document";
import DefPhotoDocumentPage from "./pages/def_photo_document";
import DefVideoDocumentPage from "./pages/def_video_document";

export default function Router(){
    return(
        <Routes>
            <Route path="/" element={<Main/>}/>
            
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/logout" element={<LogOut />}/>
            
            <Route path="/collection" element={<Collection />}/>
			<Route path="/collection/:collId" element={<DefCollection/>}/>
            
            <Route path="/document" element={<Documents />}/>
            <Route path="/document/:documentId" element={<DefDocument />}/>
			<Route path="/phono-document/:documentId" element={<DefPhonoDocumentPage />}/>
			<Route path="/photo-document/:documentId" element={<DefPhotoDocumentPage />}/>
			<Route path="/video-document/:documentId" element={<DefVideoDocumentPage />}/>
            
            <Route path="/admin" element={<AdminPanel/>}/>
            <Route path="/admin/:table" element={<AdminPanelListInfo/>}/>
            <Route path="/admin/:table/create" element={<AdminPanelCreate/>}/>
            <Route path="/admin/:table/:id" element={<AdminPanleDefInfo/>}/>
	    	<Route path="/admin/update/:table/:id" element={<AdminPanelUpdate/>}/>
			<Route path="/admin/collection/:id/comment" element={<AdminPanelCommentColl/>}/>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}    
