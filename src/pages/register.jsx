import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/partials/auth.css"
import axios from "axios";

export default function Register() {
    const [hasErroremail, setHasErroremail] = useState(true);
    const [hasErrorPassword, setHasErrorPassword] = useState(true);
    const [hasErrorPassword2, setHasErrorPassword2] = useState(true);
    const [hasError, setHasError] = useState(true);

    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [errorEmailResponse, setErrorEmailResponse] = useState(false);

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validatePassword = (password) => {
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return specialCharRegex.test(password) && password.length >= 8;
    }

    const emailValidate = (event) => {
        setEmail(event.target.value);
        if (validateEmail(event.target.value) === false || event.target.value.length === 0) {
            setHasErroremail(true);
        } else {
            setHasErroremail(false);
        }
    }

    const passwordValidate = (event) => {
        setPassword(event.target.value);
        if (validatePassword(event.target.value) === false || event.target.value.length === 0) {
            setHasErrorPassword(true);
        } else {
            setHasErrorPassword(false);
        }
    }

    const passwordConfirmValidate = (event) => {
        if (event.target.value !== password) {
            setHasErrorPassword2(true);
        } else {
            setHasErrorPassword2(false);
        }
    }

    const firstnameInput = (event) => {
        setFirstName(event.target.value);
    }

    const lastnameInput = (event) => {
        setLastname(event.target.value);
    }

    // Обновляем состояние hasError в зависимости от наличия ошибок в форме
    useEffect(() => {
        setHasError(hasErroremail || hasErrorPassword || hasErrorPassword2 || firstname.trim().length === 0 || lastname.trim().length === 0);
    }, [hasErroremail, hasErrorPassword, hasErrorPassword2, firstname, lastname]);


    async function handleSubmit(e){
        e.preventDefault();
        try{
            const dataToSend = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            }

            const response = await axios.post("http://localhost:8000/v1/register", dataToSend);
            alert('Регистрация прошла успешно!');
            navigate('/login')
        } catch (error){
            console.log(error.response)
            if(error.response.status === 409){
                setErrorEmailResponse(true)
            }
        }
    }


    // return (
    //     <div className="auth-container">
    //         <p className="auth-p">Регистрация</p>
    //         <div className="auth-form-container">
    //             <form className="auth-form" method="post" onSubmit={handleSubmit}>
    //                 <label htmlFor="firstname">Firstname</label>
    //                 <input className="auth-form-input" type="text" name="firstname" id="firstname" onChange={firstnameInput} />

    //                 <label htmlFor="lastname">Lastname</label>
    //                 <input className="auth-form-input" type="text" name="lastname" id="lastname" onChange={lastnameInput} />

    //                 <label htmlFor="email">Email</label>
    //                 <input className="auth-form-input" type="text" name="email" id="email" onChange={emailValidate} style={{ border: hasErroremail ? '1px solid red' : null }} />

    //                 <label htmlFor="password">Password</label>
    //                 <input className="auth-form-input" type="password" name="password" id="password" onChange={passwordValidate} style={{ border: hasErrorPassword ? '1px solid red' : null }} />
    //                 {hasErrorPassword ? (
    //                     <>
    //                         <p className="password-validate">Длина пароля не меньше 8 символов</p>
    //                         <p className="password-validate">Пароль должен содержать спец символы</p>
    //                     </>
    //                 ) : (
    //                     <></>
    //                 )}
    //                 <label htmlFor="password2">Confirm password</label>
    //                 <input className="auth-form-input" type="password" id="password2" onChange={passwordConfirmValidate} style={{ border: hasErrorPassword2 ? '1px solid red' : null }} />
                    
    //                 <input className={hasError ? "auth-form-submit" : "auth-form-submit-active"} type="submit" value="Подтвердить" disabled={hasError} />
                
    //                 {errorEmailResponse ? (
    //                     <p style={{"color": "red", "fontSize": "20px", "marginBottom": "0"}}>Почта уже существует!</p>
    //                 ) : (
    //                     <></>
    //                 )}
    //             </form>
    //         </div>

    //         <div className="auth-forgot">
    //             <a href="/login">Вход</a>
    //             <a href="#">Забыл пароль?</a>
    //         </div>
    //     </div>
    // )

    return (
        <div className="auth-container">
            <p className="auth-p">Registration</p>
            <div className="auth-form-container">
                <form className="auth-form" method="post" onSubmit={handleSubmit}>
                    <label htmlFor="firstname">Firstname</label>
                    <input className="auth-form-input" type="text" name="firstname" id="firstname" onChange={firstnameInput} />

                    <label htmlFor="lastname">Lastname</label>
                    <input className="auth-form-input" type="text" name="lastname" id="lastname" onChange={lastnameInput} />

                    <label htmlFor="email">Email</label>
                    <input className="auth-form-input" type="text" name="email" id="email" onChange={emailValidate} style={{ border: hasErroremail ? '1px solid red' : null }} />

                    <label htmlFor="password">Password</label>
                    <input className="auth-form-input" type="password" name="password" id="password" onChange={passwordValidate} style={{ border: hasErrorPassword ? '1px solid red' : null }} />
                    {hasErrorPassword ? (
                        <>
                            <p className="password-validate">The password is at least 8 characters long</p>
                            <p className="password-validate">The password must contain special characters</p>
                        </>
                    ) : (
                        <></>
                    )}
                    <label htmlFor="password2">Confirm password</label>
                    <input className="auth-form-input" type="password" id="password2" onChange={passwordConfirmValidate} style={{ border: hasErrorPassword2 ? '1px solid red' : null }} />
                    
                    <input className={hasError ? "auth-form-submit" : "auth-form-submit-active"} type="submit" value="Confirm" disabled={hasError} />
                
                    {errorEmailResponse ? (
                        <p style={{"color": "red", "fontSize": "20px", "marginBottom": "0"}}>Почта уже существует!</p>
                    ) : (
                        <></>
                    )}
                </form>
            </div>

            <div className="auth-forgot">
                <a href="/login">Log in</a>
                <a href="#">Forgot your password?</a>
            </div>
        </div>
    )
}
