import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        navigate("/login");

    }, [navigate]);
    return null;
}
