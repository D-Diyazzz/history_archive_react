import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import LogOut from "./pages/logout";
import Collection from "./pages/collectoins";
import Documents from "./pages/documets";
import DefDocument from "./pages/def_document";
import NotFoundPage from "./components/404_not_found";

import AdminPanel from "./pages/admin/admin_panel";
import AdminPanelListInfo from "./pages/admin/admin_list_info";
import AdminPanelCreate from "./pages/admin/admin_create";

export default function Router(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/logout" element={<LogOut />}/>
            <Route path="/collection" element={<Collection />}/>
            <Route path="/document" element={<Documents />}/>
            <Route path="/document/:documentId" element={<DefDocument />}/>
            <Route path="/admin" element={<AdminPanel/>}/>
            <Route path="/admin/:table" element={<AdminPanelListInfo/>}/>
            <Route path="/admin/:table/create" element={<AdminPanelCreate/>}/>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}    