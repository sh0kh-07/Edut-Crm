import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Select,
    Option,
    Button,
    Chip,
    Spinner,
} from "@material-tailwind/react";
import { Payment } from "../../../utils/Controllers/Payment";
import Cookies from "js-cookie";

export default function AllPayment() {
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    const today = new Date();

    const [year, setYear] = useState(String(today.getFullYear()));
    const [month, setMonth] = useState(String(today.getMonth() + 1)); // getMonth() возвращает 0-11

    const [page, setPage] = useState(1);

    const uzMonths = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    const getAllPayment = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const data = {
                school_id: Number(Cookies.get("school_id")),
                yers: Number(year),
                month: Number(month),
                page: pageNumber,
            };

            const response = await Payment.GetAllPayment(data);

            setPayments(response.data.data.records || []);
            setPagination(response.data.data.pagination || {});
            setSummary(response.data.data.summary || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPayment(page);
    }, [page]);

    const applyFilter = () => {
        setPage(1);
        getAllPayment(1);
    };

    return (
        <div className="w-full">
            {/* Filter */}
            <Card className="mb-4 p-4">
                <Typography variant="h6" className="font-bold mb-3">
                    To‘lovlarni filterlash
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select
                        label="Yil"
                        value={year}
                        onChange={(v) => setYear(v)}
                        containerProps={{ className: "w-full" }}
                        className="w-full"
                    >
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                    </Select>

                    <Select
                        label="Oy"
                        value={month}
                        onChange={(v) => setMonth(v)}
                        containerProps={{ className: "w-full" }}
                        className="w-full"
                    >
                        {uzMonths.map((m, i) => (
                            <Option key={i} value={String(i + 1)}>
                                {m}
                            </Option>
                        ))}
                    </Select>

                    <Button className="bg-blue-600 w-full md:w-auto" onClick={applyFilter}>
                        Filterni qo‘llash
                    </Button>
                </div>

            </Card>

            {/* Summary */}
            {summary && (
                <Card className="p-4 mb-4">
                    <Typography variant="h6" className="font-bold mb-2">Umumiy ma’lumotlar</Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="p-3 bg-blue-50">
                            <Typography className="font-bold">To‘lovlar soni:</Typography>
                            <Typography>{summary.paymentCount}</Typography>
                        </Card>

                        <Card className="p-3 bg-green-50">
                            <Typography className="font-bold">Chegirma qo‘yilganlar:</Typography>
                            <Typography>{summary.discountCount}</Typography>
                        </Card>

                        <Card className="p-3 bg-yellow-50">
                            <Typography className="font-bold">Yarim to‘lovlar:</Typography>
                            <Typography>{summary.halfPaymentCount}</Typography>
                        </Card>
                    </div>
                </Card>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Spinner className="h-10 w-10" />
                </div>
            ) : payments.length === 0 ? (
                <Typography className="text-center py-6">
                    To‘lovlar topilmadi
                </Typography>
            ) : (
                payments.map((p) => (
                    <Card key={p.id} className="mb-4">
                        <CardBody>
                            <div className="flex justify-between items-center">
                                <div>
                                    <Typography className="font-bold text-lg">
                                        {p.student_name}
                                    </Typography>

                                    <Typography className="text-gray-600">
                                        O‘qituvchi: {p.teacher_name}
                                    </Typography>

                                    <Typography className="text-gray-600">
                                        Guruh: {p.group_name} ({p.group_price} UZS)
                                    </Typography>

                                    <Typography className="text-gray-800 font-semibold">
                                        To‘lov: {p.price.toLocaleString("ru-RU")} UZS
                                    </Typography>

                                    <Typography>
                                        Chegirma: {p.discountSum} so`m
                                    </Typography>

                                    <Typography>
                                        Oy: {p.month}
                                    </Typography>

                                    <Typography className="text-gray-500 text-sm">
                                        Sana: {new Date(p.createdAt).toLocaleDateString()}
                                    </Typography>
                                </div>
                            </div>
                            <div className="mt-2 bg-gray-100 p-3 rounded">
                                <Typography className="text-sm text-gray-700">
                                    Izoh: {p.description || "-"}
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="bg-gray-700"
                    >
                        Oldingi
                    </Button>

                    <Typography>
                        {pagination.currentPage} / {pagination.total_pages}
                    </Typography>

                    <Button
                        disabled={page === pagination.total_pages}
                        onClick={() => setPage(page + 1)}
                        className="bg-gray-700"
                    >
                        Keyingi
                    </Button>
                </div>
            )}
        </div>
    );
}
