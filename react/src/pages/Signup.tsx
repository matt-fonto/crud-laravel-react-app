import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const Signup = () => {
    const nameRef: React.RefObject<HTMLInputElement> = useRef(null);
    const emailRef: React.RefObject<HTMLInputElement> = useRef(null);
    const passwordRef: React.RefObject<HTMLInputElement> = useRef(null);
    const passwordConfirmationRef: React.RefObject<HTMLInputElement> =
        useRef(null);

    // error states
    const [nameError, setNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [passwordConfirmationError, setPasswordConfirmationError] =
        useState<string>("");

    const { setUser, setToken } = useStateContext();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            name: nameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            password_confirmation: passwordConfirmationRef.current?.value,
        };

        // We send a post request to the server, to the singup route passing the payload.
        // expect a response with the user and token
        // it then updates the user and token in the context with the response
        try {
            const response = await axiosClient.post("/signup", payload);
            const data = response.data;
            setUser(data.user);
            setToken(data.token);
        } catch (error: any) {
            if (error.response) {
                const { errors } = error.response.data;

                // Update the errors in the state
                if (errors.name) setNameError(errors.name[0]);
                if (errors.email) setEmailError(errors.email[0]);
                if (errors.password) setPasswordError(errors.password[0]);
                if (errors.password_confirmation)
                    setPasswordConfirmationError(
                        errors.password_confirmation[0]
                    );
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form action="" onSubmit={onSubmit}>
                    <h1 className="title">Signup for free</h1>
                    {nameError && <p className="error">{nameError}</p>}
                    <input ref={nameRef} type="text" placeholder="Full Name" />

                    {emailError && <p className="error">{emailError}</p>}
                    <input ref={emailRef} type="email" placeholder="Email" />

                    {passwordError && <p className="error">{passwordError}</p>}
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />

                    {passwordConfirmationError && (
                        <p className="error">{passwordConfirmationError}</p>
                    )}
                    <input
                        ref={passwordConfirmationRef}
                        type="password"
                        placeholder="Password Confirmation"
                    />

                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Already Registered? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
