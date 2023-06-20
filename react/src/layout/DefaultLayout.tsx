import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect } from "react";

const DefaultLayout = () => {
    // calling the context
    const { user, token, setUser, setToken } = useStateContext();

    // Everything that is inside the default layout will be rendered only if the user is logged in
    if (!token) return <Navigate to="/login" />;

    // get information about the user
    useEffect(() => {
        // Call the fetchUser function
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axiosClient.get("/user");
            const { data } = response;
            setUser(data);
        } catch (error) {
            console.error(error);
        }
    };

    const onLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        logout();
    };

    const logout = async () => {
        try {
            await axiosClient.post("/logout");
            setUser({});
            setToken(null);
        } catch (error) {
            console.error(error);
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
