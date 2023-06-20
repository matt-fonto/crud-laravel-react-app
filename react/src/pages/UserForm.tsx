import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useParams, useNavigate } from "react-router-dom";

export type NewUser = {
    id: number | null;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const UserForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<NewUser>({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchUser(id);
    }, [id]);

    const fetchUser = async (id: string) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/users/${id}`);
            const { data } = response;
            setUser(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            // great to use the finally block to set loading to false
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const apiCall = id
            ? axiosClient.put(`/users/${id}`, user)
            : axiosClient.post("/signup", user);

        console.log(user);
        try {
            await apiCall;
            navigate("/users");
        } catch (error: any) {
            if (error.response) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <div>
            {/* If the user exists */}

            {/* If the user doesn't exist */}

            {user.id && <h1>Edit User</h1>}
            {!user.id && <h1>Create User</h1>}

            <div className="card animated fadeInDown">
                {
                    // if loading is true, then show the loading text
                    loading && <div className="text-center">Loading...</div>
                }

                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                {!loading && (
                    <form onSubmit={handleSubmit}>
                        <input
                            value={user.name}
                            onChange={(ev) =>
                                setUser({ ...user, name: ev.target.value })
                            }
                            placeholder="Name"
                        />
                        <input
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password: ev.target.value,
                                })
                            }
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            placeholder="Password Confirmation"
                        />

                        <div className="form-group">
                            <button type="submit" className="btn">
                                {id ? "Update" : "Create"} User
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserForm;
