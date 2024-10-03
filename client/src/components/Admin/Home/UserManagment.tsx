import { toast, Toaster } from "sonner";
import {  createAdminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { useEffect, useState } from "react";
import { UserData } from "../../../interface/UsersInterface/UserInterface";
import { useDebonceSearch } from "../../../hooks/useDebonceSearch";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [defaultUser, setDefaultUser] = useState<UserData[]>([]);
    const [limit] = useState(3); 

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

    const [debouncedSearchQuery] = useDebonceSearch(searchQuery, 500);

    async function fetchUsers(page: number = 1) {
        try {
            const response = await adminAxios.get(`${adminEndpoints.fetchUsers}?page=${page}&limit=${limit}`);

            if (response.status === 200) {
                setUsers(response.data.data.users);
                setTotalPages(response.data.data.totalPages);
                setDefaultUser(response.data.data.users);
            }
        } catch (error) {
            console.log("Error fetching users", error);
            toast.error("Error fetching users");
        }
    }

    async function searchUser(){
        try {
            if (searchQuery.trim() === "") {
                setUsers(defaultUser);
                return;
            }

            const response = await adminAxios.get(`${adminEndpoints.searchUser}?search=${searchQuery}`)
            console.log(response);
            if(response.status == 200){
                setUsers(response.data.data);
            }
        } catch (error :any) {
            const errorMessage = error?.response?.data?.message || "Error occure";
            toast.error(errorMessage);
            console.log("Error fetching users", error);
        }
    }

    const blockUser = async (userId: string) => {
        try {
            const response = await adminAxios.put(`${adminEndpoints.blockUser}/${userId}`);
            if (response.status == 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isStatus: !user.isStatus } : user
                    )
                );
                toast.success(response.data.message);
            }
        } catch (error : any) {
            const errorMessage = error?.response?.data?.message || "Error occure cant login";
            toast.error(errorMessage);
            console.log("Error occurred blocking users", error);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (debouncedSearchQuery) {
            searchUser();
        } else {
            setUsers(defaultUser);
        }
    }, [debouncedSearchQuery]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
              <Toaster position="top-center" expand={false} richColors />
            <div className='text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent pl-8 pt-7 justify-center flex'>
                User Management
            </div>
            <div className="flex justify-end mr-28 mt-5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    name="search"
                    placeholder="search user"
                    className="px-3 py-2 rounded-lg bg-slate-300 text-white font-semibold"
                />
            </div>
            <div className="overflow-x-auto p-8 mt-10 justify-center flex">
                <table className="table-auto w-1/2 text-left">
                    <thead>
                        <tr className="text-white bg-gray-800">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="bg-gray-700 text-slate-300">
                                <td className="p-3">{user.userName}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.phone}</td>
                                <td className="p-3">{user.isStatus ? 'Active' : 'Blocked'}</td>
                                <td className="p-3 flex gap-4">
                                <button onClick={() => blockUser(user._id)}
                                        className={`px-3 py-1 rounded-lg text-white ${user.isStatus ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {user.isStatus ? "Block" : "Unblock"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-5">
                <button
                    className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 text-white">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default UserManagement;
