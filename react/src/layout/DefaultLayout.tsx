import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const DefaultLayout = () => {
    // calling the context
    const { user, token } = useStateContext();

    // Everything that is inside the default layout will be rendered only if the user is logged in
    if (!token) return <Navigate to="/login" />;

    const onLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Retrieve the token from the local storage
        const token = localStorage.getItem("token");

        // Define config to add the token to the headers
        const config = {
            // We add the token to the headers
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            // We send a post request to the server, to the logout route
            // axiosClient.post("/route", payload, config)
            const response = await axiosClient.post("/logout", {}, config);

            // If the response is successful, we remove the token from the local storage
            if (response.status === 200) {
                localStorage.removeItem("token");
            }

            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id="defaultLayout">
            {/* Sidebar */}
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>

            <div className="content">
                <header>
                    <div className="">Header</div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>

                {/* Main content */}
                <main>
                    {/* Outlet: where the children will be rendered */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DefaultLayout;
