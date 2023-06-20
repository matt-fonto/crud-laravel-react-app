import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

export type ExistingUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

const Users = () => {
    const [users, setUsers] = useState<ExistingUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (page: number) => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/users?page=${page}`);
            const { data } = response;

            // since the data we get is an object with a data property, we need to access that property
            setUsers(data.data);
            setLastPage(data.meta.last_page);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await axiosClient.delete(`/users/${id}`);
            fetchUsers(page);
        } catch (error) {
            console.error(error);
        }
    };

    const nextPage = () => {
        // if the current page is less than the last page, then we can go to the next page
        if (page < lastPage) {
            setPage(page + 1);
        } else {
            // else, meaning that we are on the last page, then we go back to the first page
            setPage(1);
        }
    };

    const prevPage = () => {
        // if the current page is greater than 1, then we can go to the previous page
        if (page > 1) {
            setPage(page - 1);
        } else {
            // else, meaning that we are on the first page, then we go to the last page
            setPage(lastPage);
        }
    };

    return (
        // table of users
        <div className="container">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/create" className="btn-add">
                    Add New
                </Link>
            </div>

            <div className="card animated fadeInDown">
                <table>
                    {/* head */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    {/* loading */}
                    {loading && (
                        <tbody>
                            <td colSpan={5} className="text-center">
                                Loading...
                            </td>
                        </tbody>
                    )}

                    {/* Content */}
                    {!loading && (
                        <tbody>
                            {users &&
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </Link>
                                            {/* nbsp: non-breaking space */}
                                            &nbsp;
                                            <button
                                                onClick={(e) =>
                                                    onDelete(user.id)
                                                }
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    )}
                </table>

                <div className="container-pagination">
                    <button className="btn-prev" onClick={prevPage}>
                        &#8249;
                    </button>
                    <button className="btn-next" onClick={nextPage}>
                        &#8250;
                    </button>
                </div>
            </div>

            {/* {!loading ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Created at</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    </tbody>
                </table>
            ) : (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Users;
