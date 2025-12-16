import { useEffect, useState } from "react";
import { StudentApi } from "../../../utils/Controllers/StudentApi";
import Create from "./_components/Create";
import Cookies from "js-cookie";

import { Button, Tooltip } from "@material-tailwind/react";
import { Phone, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Delete from "./_components/Delete";
import Put from "./_components/Put";
import Eye from "../../Other/UI/Icons/Eye";
import { NavLink } from "react-router-dom";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Add from "./_components/Add";

export default function Student() {
    const [students, setStudents] = useState([]);
    const type = Cookies?.get('type')

    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
    });
    const [loading, setLoading] = useState(false);

    const GetStudent = async (page = 1) => {
        setLoading(true);
        try {
            const data = {
                school_id: Number(Cookies?.get("school_id")),
                page,
            };

            const response = await StudentApi.Get(data);

            setStudents(response?.data?.data?.records || []);
            setPagination(response?.data?.data?.pagination || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetStudent(1);
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3 sm:gap-0">
                <h1 className="text-[25px] font-bold">{type === "PreSchool" ? "Bolalar" : "Talabalar"}</h1>
                <Create refresh={() => GetStudent(pagination.currentPage)} />
            </div>

            {students?.length > 0 ? (
                <>
                    {/* Table wrapper для скролла на мобильных */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-[400px] sm:min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm">#</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm">{type === "PreSchool" ? "Bola" : "Talaba"}</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm hidden sm:table-cell">Telefon</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm hidden md:table-cell">Ota-ona</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm hidden md:table-cell">Ota-ona tel</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm hidden lg:table-cell">Status</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm hidden lg:table-cell">Yaratilgan sana</th>
                                    <th className="px-2 py-2 text-left text-gray-600 font-medium text-sm">Ammalar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {students.map((s, index) => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition">
                                        <td className="px-2 py-2 text-sm">{index + 1 + (pagination.currentPage - 1) * 10}</td>
                                        <td className="px-2 py-2 text-sm flex items-center gap-1 sm:gap-2">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" /> {s.full_name}
                                        </td>
                                        <td className="px-2 py-2 text-sm hidden sm:table-cell">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" /> {s.phone_number}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 text-sm hidden md:table-cell">{s.parents_full_name}</td>
                                        <td className="px-2 py-2 text-sm hidden md:table-cell">{s.parents_phone_number}</td>
                                        <td className="px-2 py-2 text-sm hidden lg:table-cell">{s.status ? "Faol" : "No Faol"}</td>
                                        <td className="px-2 py-2 text-sm hidden lg:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" /> {new Date(s.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 text-sm">
                                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 sm:gap-2">
                                                <Tooltip content="Korish">
                                                    <NavLink to={`/admin/student/${s?.id}`}>
                                                        <Button className="bg-blue-600 p-[9px] text-white hover:bg-blue-700 active:bg-blue-800 normal-case  sm:p-2">
                                                            <Eye size={16} />
                                                        </Button>
                                                    </NavLink>
                                                </Tooltip>
                                                <Add student={s} refresh={() => GetStudent(pagination.currentPage)} />
                                                <Put data={s} refresh={() => GetStudent(pagination.currentPage)} />
                                                <Delete id={s?.id} refresh={() => GetStudent(pagination.currentPage)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination?.total_pages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4">
                            <Button
                                className="bg-black text-white p-2 sm:p-3"
                                disabled={pagination.currentPage <= 1 || loading}
                                onClick={() => GetStudent(pagination.currentPage - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>

                            <div className="font-medium text-sm sm:text-base">{pagination.currentPage} / {pagination.total_pages}</div>

                            <Button
                                className="bg-black text-white p-2 sm:p-3"
                                disabled={pagination.currentPage >= pagination.total_pages || loading}
                                onClick={() => GetStudent(pagination.currentPage + 1)}
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyData text={type === "PreSchool" ? "Bolalar mavjud emas" : "Talaba mavjud emas"} />
            )}
        </>
    );
}
