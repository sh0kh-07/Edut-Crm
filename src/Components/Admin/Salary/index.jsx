import { useEffect, useState } from "react";

import Put from "./component/Put"; 

import { Card, CardBody } from "@material-tailwind/react";
import { Users, Wallet } from "lucide-react";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Cookies from "js-cookie";
import { SalaryApi } from "../../../utils/Controllers/Salary";
import Create from "./component/Create";
import Delete from "./component/Delete";

export default function Salary() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const school_id = Number(Cookies.get("school_id"));
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

  const getSalaries = async () => {
    try {
        setLoading(true);
        const response = await SalaryApi.GetByMonth({
            school_id,
            year: currentYear,
            month: currentMonth,
            page: 1,
        });
       setSalaries(response?.data?.data?.records || []);


    } catch (error) {
        console.log("Salary fetch error:", error);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        getSalaries();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[25px] font-bold">Oylik To'lovlar</h1>
                <Create refresh={getSalaries} />
            </div>

            {salaries?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {salaries.map((salary) => (
                        <Card
                            key={salary.teacher_id + "-" + salary.month}
                            className="border border-gray-200 shadow-sm rounded-xl p-3 hover:shadow-md transition"
                        >
                            <CardBody className="flex flex-col gap-4 p-[10px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[20px] font-semibold">
                                        <Wallet className="w-6 h-6 text-gray-700" />
                                        {salary.teacher_id} 
                                    </div>
                                    <div className="flex items-center gap-[10px]">
                                         <Put data={salary} refresh={getSalaries} />
                                        <Delete id={salary.teacher_id} refresh={getSalaries} /> 
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">
                                        {salary.price.toLocaleString()} so‘m - {salary.method}
                                    </span>
                                </div>

                                <div className="text-gray-500 text-sm">
                                    Oy: {salary.month} <br />
                                    Izoh: {salary.description || "Izoh yo‘q"}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyData text="Hozircha to‘lovlar mavjud emas" />
            )}
        </>
    );
}
