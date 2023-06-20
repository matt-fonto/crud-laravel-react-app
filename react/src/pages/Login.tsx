import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const Login = () => {
    const emailRef: React.RefObject<HTMLInputElement> = useRef(null);
    const passwordRef: React.RefObject<HTMLInputElement> = useRef(null);

    // error states
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const { setUser, setToken } = useStateContext();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
        };

        // We send a post request to the server, to the login route passing the payload.
        try {
            const response = await axiosClient.post("/login", payload);
            const data = response.data;

            // We update the user and token in the context with the response
            setUser(data.user);
            setToken(data.token);
        } catch (error: any) {
            if (error.response) {
                const { errors } = error.response.data;

                // Update the errors in the state
                if (errors.email) setEmailError(errors.email[0]);
                if (errors.password) setPasswordError(errors.password[0]);
            }
        }
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form action="" onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>

                    {emailError && <p className="error">{emailError}</p>}
                    <input ref={emailRef} type="email" placeholder="Email" />

                    {passwordError && <p className="error">{passwordError}</p>}
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />

                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not Registered?{" "}
                        <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
