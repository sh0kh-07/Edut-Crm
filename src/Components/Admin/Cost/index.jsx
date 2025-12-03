import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { Button } from "@material-tailwind/react";
import { Calendar, ChevronLeft, ChevronRight, DollarSign, FileText } from "lucide-react";

import { CostApi } from "../../../utils/Controllers/CostApi";

import Create from "./_components/Create";

import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Put from "./_components/Put";
import Delete from "./_components/Delete";

export default function Cost() {
    const [costs, setCosts] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
    });

    const [loading, setLoading] = useState(false);

    const GetCosts = async (page = 1) => {
        setLoading(true);

        try {
            const school_id = Number(Cookies.get("school_id"));

           const res = await CostApi.GetPagination({
    school_id: 1,
    year: 2025,
    month: 12,
    page: 1
});


            setCosts(res?.data?.data?.records || []);
            setPagination(res?.data?.data?.pagination || {});

        } catch (error) {
            console.log("Cost Get Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetCosts(1);
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[25px] font-bold">Xarajatlar</h1>
                <Create refresh={() => GetCosts(pagination.currentPage)} />
            </div>

            {costs.length > 0 ? (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">#</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Kategoriya</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Narx</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Metod</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Oy</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Izoh</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Sana</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Amallar</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {costs.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {index + 1 + (pagination.currentPage - 1) * 10}
                                        </td>

                                        <td className="px-4 py-2">{item.costCategory.name}</td>

                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-gray-700" />
                                                {item.price.toLocaleString()} so‘m
                                            </div>
                                        </td>

                                        <td className="px-4 py-2">
                                            {item.method == 1
                                                ? "Naqd"
                                                : item.method == 2
                                                    ? "Karta"
                                                    : "Bank o'tkazma"}
                                        </td>

                                        <td className="px-4 py-2">{item.month}-oy</td>

                                        <td className="px-4 py-2">{item.description}</td>

                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-[10px]">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>

                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-[5px]">
                                                 <Put
                                                    data={item}
                                                    refresh={() => GetCosts(pagination.currentPage)}
                                                /> 
                                                <Delete
                                                    id={item.id}
                                                    data={item}
                                                    refresh={() => GetCosts(pagination.currentPage)}
                                                /> 
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination?.total_pages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4">
                            <Button
                                className="bg-black text-white p-3"
                                disabled={pagination.currentPage <= 1}
                                onClick={() => GetCosts(pagination.currentPage - 1)}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="font-medium">
                                {pagination.currentPage} / {pagination.total_pages}
                            </div>

                            <Button
                                className="bg-black text-white p-3"
                                disabled={pagination.currentPage >= pagination.total_pages}
                                onClick={() => GetCosts(pagination.currentPage + 1)}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyData text="Xarajatlar mavjud emas" />
            )}
        </>
    );
}
