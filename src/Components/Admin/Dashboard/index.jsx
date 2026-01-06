import { useEffect, useState } from "react";
import { Statistik } from "../../../utils/Controllers/Statistik";
import Cookies from "js-cookie";
import {
    Card,
    CardBody,
    Typography,
    Select,
    Option
} from "@material-tailwind/react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [card, setCard] = useState(null);
    const [lineData, setLineData] = useState([]);
    const [year, setYear] = useState(2026);

    const getCardAnaliz = async () => {
        try {
            const response = await Statistik.GetCard(Number(Cookies.get("school_id")));
            setCard(response?.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getLineAnaliz = async (yearValue) => {
        try {
            const data = {
                years: yearValue,
                id: Number(Cookies.get("school_id")),
            };
            const response = await Statistik.GetLine(data);

            const months = [
                "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
                "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
            ];

            const formatted = response?.data?.PaymentStats?.map((value, index) => ({
                month: months[index],
                payment: value
            }));

            setLineData(formatted);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCardAnaliz();
        getLineAnaliz(year);
    }, [year]);

    return (
        <div className=" space-y-10">

            {/* ---------- STAT CARDS ---------- */}
            {card && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                    <Card className="shadow-lg">
                        <CardBody>
                            <Typography variant="h6">O'quvchilar</Typography>
                            <Typography variant="h4">{card.student_number}</Typography>
                        </CardBody>
                    </Card>

                    <Card className="shadow-lg">
                        <CardBody>
                            <Typography variant="h6">Xodimlar</Typography>
                            <Typography variant="h4">{card.employee_number}</Typography>
                        </CardBody>
                    </Card>

                    <Card className="shadow-lg">
                        <CardBody>
                            <Typography variant="h6">Guruhlar</Typography>
                            <Typography variant="h4">{card.group_number}</Typography>
                        </CardBody>
                    </Card>

                    <Card className="shadow-lg">
                        <CardBody>
                            <Typography variant="h6">To'lovlar</Typography>
                            <Typography variant="h4">{card.payment_sum.toLocaleString()} so'm</Typography>
                        </CardBody>
                    </Card>

                </div>
            )}

            {/* ---------- LINE CHART ---------- */}
            <Card className="shadow-xl p-5">

                {/* HEADER WITH SELECT */}
                <div className="flex items-center gap-[10px] mb-4">
                    <Typography variant="h6">
                        Oylik to'lov statistikasi ({year})
                    </Typography>

                    <div className="w-32">
                        <Select label="Yil" value={year} onChange={(val) => setYear(Number(val))}>
                            <Option value={2023}>2023</Option>
                            <Option value={2024}>2024</Option>
                            <Option value={2025}>2025</Option>
                            <Option value={2026}>2026</Option>
                        </Select>
                    </div>
                </div>

                {/* CHART */}
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="payment" stroke="#000" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>

            </Card>

        </div>
    );
}
