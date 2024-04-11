import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from '../api';
import "../style/partials/auth.css"

export default function Login(){
    const [hasError, setHasError] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasErorrPost, setHasErrorPost] = useState(false)
    const navigate = useNavigate()

    function emailInput(event){
        setEmail(event.target.value);
    }

    function passwordInput(event){
        setPassword(event.target.value);
    }

    useEffect(() => {
        setHasError(email.trim().length === 0 || password.trim().length === 0);
    }, [email, password])

    async function handleSubmit(e) {
        e.preventDefault();
        try{

            const dataToSend = {
                email: email,
                password: password,
            };

            const response = await axios.post("http://localhost:8000/v1/login", dataToSend);
            const access_token = response.data["access_token"];
            const refresh_token = response.data["refresh_token"];
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token)
            localStorage.setItem('user_name', response.data['user_name']);
            localStorage.setItem("user_role", response.data["user_role"]);
            navigate('/')
        } catch (error){
            setHasErrorPost(true);
        }
    }

    // return (
    //     <>
    //     <div className="auth-container">
    //         <p className="auth-p">ВХОД</p>
    //         <div className="auth-form-container">
    //             <form className="auth-form" method="POST" onSubmit={handleSubmit}>
    //                 <label htmlFor="email">Email</label>
    //                 <input className="auth-form-input" type="text" name="email" id="email" onChange={emailInput}/>

    //                 <label htmlFor="password">Password</label>
    //                 <input className="auth-form-input" type="password" name="password" id="password" onChange={passwordInput}/>

    //                 <input className={hasError ? "auth-form-submit" : "auth-form-submit-active"} type="submit" value="Подтвердить" disabled={hasError}/>
    //                 {hasErorrPost ? (
    //                     <p style={{"color": "red", "fontSize": "20px", "marginBottom": "0"}}>Не правильный пароль или почта!</p>
    //                 ) : (
    //                     <></>
    //                 )}
                   
    //             </form>
    //         </div>

    //         <div className="auth-forgot">
    //             <a href="/register">Регистрация</a>
    //             <a href="#">Забыл пароль?</a>
    //         </div>
    //     </div>
    //     </>
    // )

    return (
        <>
        <div className="auth-container">
            <p className="auth-p">Log In</p>
            <div className="auth-form-container">
                <form className="auth-form" method="POST" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input className="auth-form-input" type="text" name="email" id="email" onChange={emailInput}/>

                    <label htmlFor="password">Password</label>
                    <input className="auth-form-input" type="password" name="password" id="password" onChange={passwordInput}/>

                    <input className={hasError ? "auth-form-submit" : "auth-form-submit-active"} type="submit" value="Confirm" disabled={hasError}/>
                    {hasErorrPost ? (
                        <p style={{"color": "red", "fontSize": "20px", "marginBottom": "0"}}>Не правильный пароль или почта!</p>
                    ) : (
                        <></>
                    )}
                   
                </form>
            </div>

            <div className="auth-forgot">
                <a href="/register">Registration</a>
                <a href="#">Forgot your password?</a>
            </div>
        </div>
        </>
    )
}