import { useEffect, useState } from "react";
import { Employee } from "../../../utils/Controllers/Employee";
import Create from "./_components/Create";
import Cookies from "js-cookie";

import { Card, CardBody, Button } from "@material-tailwind/react";
import { User, Phone, DollarSign, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Delete from "./_components/Delete";
import Put from "./_components/Put";
import Add from "./_components/Add";
import AddSub from "./_components/AddSub";

export default function Teacher() {
    const [teachers, setTeachers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
    });

    const [loading, setLoading] = useState(true);

    const getTeacher = async (page = 1) => {
        setLoading(true);
        try {
            const data = {
                page,
                school_id: Cookies.get("school_id"),
                role: "teacher",
            };

            const response = await Employee.GetByRole(data);

            setTeachers(response?.data?.data?.records || []);
            setPagination(response?.data?.data?.pagination || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeacher(1);
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[25px] font-bold">Ustozlar</h1>
                <Create refresh={() => getTeacher(pagination.currentPage)} />
            </div>
            {teachers?.length > 0 ? (
                <>
                    {/* List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teachers.map((t) => (
                            <Card
                                key={t.id}
                                className="border border-gray-200 rounded-xl shadow-sm p-3 hover:shadow-md transition"
                            >
                                <CardBody className="flex flex-col gap-3">

                                    {/* Name */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[20px] font-semibold">
                                            <User className="w-6 h-6 text-gray-700" />
                                            {t.full_name}
                                        </div>
                                        <div className="flex items-center gap-[10px]">
                                            <AddSub employee={t} refresh={getTeacher} />
                                            <Add employee={t} refresh={getTeacher} />
                                            <Put teacher={t} refresh={getTeacher} />
                                            <Delete id={t?.id} refresh={getTeacher} />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-5 h-5" />
                                        {t.phone_number}
                                    </div>

                                    {/* Salary */}
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <DollarSign className="w-5 h-5" />
                                        {t.salary.toLocaleString()} so'm
                                    </div>

                                    {/* Login */}
                                    <div className="text-gray-700">
                                        Login: <span className="font-medium">{t.login}</span>
                                    </div>

                                    {/* Created date */}
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 gap-4">

                        <Button
                            className="bg-black text-white p-3"
                            disabled={pagination.currentPage <= 1}
                            onClick={() => getTeacher(pagination.currentPage - 1)}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center font-medium">
                            {pagination.currentPage} / {pagination.total_pages}
                        </div>

                        <Button
                            className="bg-black text-white p-3"
                            disabled={pagination.currentPage >= pagination.total_pages}
                            onClick={() => getTeacher(pagination.currentPage + 1)}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>

                    </div>
                </>
            ) : (
                <EmptyData text={'Ustozlar mavjud emas'} />
            )}
        </>
    );
}
