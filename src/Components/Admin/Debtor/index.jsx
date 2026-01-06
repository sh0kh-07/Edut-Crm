import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Select,
    Option,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import { DebtorApi } from "../../../utils/Controllers/DebtorApi";
import { ChevronLeft, ChevronRight, Users, Wallet, Percent, Calendar } from "lucide-react";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Loading from "../../Other/UI/Loadings/Loading";

const months = [
    { value: 1, label: "Yanvar" },
    { value: 2, label: "Fevral" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" },
    { value: 5, label: "May" },
    { value: 6, label: "Iyun" },
    { value: 7, label: "Iyul" },
    { value: 8, label: "Avgust" },
    { value: 9, label: "Sentabr" },
    { value: 10, label: "Oktabr" },
    { value: 11, label: "Noyabr" },
    { value: 12, label: "Dekabr" },
];

const formatPrice = (n) => {
    if (n === null || n === undefined) return "0";
    const s = String(n).replace(/\D/g, "");
    if (s === "") return "0";
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Функция для форматирования даты
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function Debtor() {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(thisYear);
    const [month, setMonth] = useState(thisMonth);
    const [page, setPage] = useState(1);

    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
    });
    const [loading, setLoading] = useState(false);

    const yearsRange = Array.from({ length: 8 }, (_, i) => 2023 + i);

    const getDebtor = async () => {
        try {
            setLoading(true);
            const payload = {
                school_id: Number(Cookies?.get("school_id")),
                yers: Number(year),
                month: Number(month),
                page: Number(page),
            };

            const res = await DebtorApi.GetDebtor(payload);
            const body = res?.data?.data || {};
            setRecords(body.records || []);
            setPagination(body.pagination || { currentPage: 1, total_pages: 1 });
        } catch (err) {
            console.error("GetDebtor error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDebtor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month, page]);

    // Функция для расчета суммарной оплаты
    const calculateTotalPaid = (payments) => {
        if (!payments || payments.length === 0) return 0;
        return payments.reduce((sum, payment) => sum + (payment.paid_amount || 0), 0);
    };

    // Функция для расчета суммарной скидки
    const calculateTotalDiscount = (payments) => {
        if (!payments || payments.length === 0) return 0;
        return payments.reduce((sum, payment) => sum + (payment.discount_amount || 0), 0);
    };

    // Функция для расчета чистого дохода (оплата минус скидка)
    const calculateNetIncome = (payments) => {
        return calculateTotalPaid(payments) - calculateTotalDiscount(payments);
    };

    return (
        <div className="">
            {/* Header + filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-[20px]">
                <div>
                    <h1 className="text-xl md:text-[25px] font-bold text-gray-800">Qarzdorlar</h1>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto ">
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-48 ">
                            <Select
                                value={String(year)}
                                onChange={(val) => {
                                    setPage(1);
                                    setYear(Number(val));
                                }}
                                className="border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                labelProps={{
                                    className: "text-gray-500 text-sm font-medium before:content-none after:content-none"
                                }}
                                containerProps={{
                                    className: "min-w-[120px]"
                                }}
                            >
                                {yearsRange.map((y) => (
                                    <Option key={y} value={String(y)} className="text-gray-700 hover:bg-blue-50">
                                        {y}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="w-full md:w-48">
                            <Select
                                value={String(month)}
                                onChange={(val) => {
                                    setPage(1);
                                    setMonth(Number(val));
                                }}
                                className="border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                labelProps={{
                                    className: "text-gray-500 text-sm font-medium before:content-none after:content-none"
                                }}
                                containerProps={{
                                    className: "min-w-[160px]"
                                }}
                            >
                                {months.map((m) => (
                                    <Option key={m.value} value={String(m.value)} className="text-gray-700 hover:bg-blue-50">
                                        {m.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Button
                        size="md"
                        color="blue"
                        onClick={() => {
                            setPage(1);
                            getDebtor();
                        }}
                        className="w-full md:w-auto px-6"
                    >
                        Qidirish
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <Loading />
            ) : records.length === 0 ? (
                <EmptyData text={`Malumot yo'q`} />
            ) : (
                <div className="space-y-4">
                    {records.map((item) => {
                        const totalPaid = calculateTotalPaid(item.payments);
                        const totalDiscount = calculateTotalDiscount(item.payments);
                        const netIncome = calculateNetIncome(item.payments);
                        const hasPayments = item.payments && item.payments.length > 0;

                        return (
                            <Card key={item.id} className="w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                <div className="p-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <Typography className="font-semibold text-gray-800 truncate">
                                                    {item.student_name}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600 truncate">
                                                    Guruh nomi: {item.group_name}
                                                </Typography>
                                                {item.teacher_name && (
                                                    <Typography variant="small" className="text-gray-500 truncate">
                                                        O'qituvchi: {item.teacher_name}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                            <div className="text-left sm:text-center">
                                                <div className="text-sm text-gray-500">Guruh narxi</div>
                                                <div className="font-semibold text-gray-800">
                                                    {formatPrice(item.group_price)} so'm
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-center">
                                                <div className="text-sm text-gray-500">To'langan</div>
                                                <div className="font-bold text-green-600 flex items-center gap-1">
                                                    <Wallet className="w-4 h-4" />
                                                    {formatPrice(totalPaid)} so'm
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-center">
                                                <div className="text-sm text-gray-500">Chegirma</div>
                                                <div className="font-bold text-orange-600 flex items-center gap-1">
                                                    {formatPrice(totalDiscount)} so'm
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-center">
                                                <div className="text-sm text-gray-500">Qarzi</div>
                                                <div className="font-bold text-red-600">
                                                    {formatPrice(item.debt)} so'm
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Детали платежей */}
                                    {hasPayments && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Typography variant="small" className="text-gray-600 font-medium mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                To'lovlar tarixi:
                                            </Typography>
                                            <div className="space-y-2">
                                                {item.payments.map((payment, index) => (
                                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm text-gray-600">
                                                                {formatDate(payment.payment_date)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-sm">
                                                                <span className="text-gray-600">To'landi: </span>
                                                                <span className="font-semibold text-green-600">
                                                                    {formatPrice(payment.paid_amount)} so'm
                                                                </span>
                                                            </div>
                                                            {payment.discount_amount > 0 && (
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Chegirma: </span>
                                                                    <span className="font-semibold text-orange-600">
                                                                        {formatPrice(payment.discount_amount)} so'm
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Сводка */}
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div className="text-sm">
                                                        <span className="text-gray-600">Jami to'langan: </span>
                                                        <span className="font-bold text-green-600">
                                                            {formatPrice(totalPaid)} so'm
                                                        </span>
                                                    </div>
                                                    {totalDiscount > 0 && (
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Jami chegirma: </span>
                                                            <span className="font-bold text-orange-600">
                                                                {formatPrice(totalDiscount)} so'm
                                                            </span>
                                                        </div>
                                                    )}
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!hasPayments && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                            <Typography variant="small" className="text-gray-500 italic">
                                                Hozircha to'lov qilinmagan
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        size="sm"
                        variant="outlined"
                        color="blue"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="px-3 py-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(3, pagination.total_pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.total_pages <= 3) {
                                pageNum = i + 1;
                            } else if (page <= 2) {
                                pageNum = i + 1;
                            } else if (page >= pagination.total_pages - 1) {
                                pageNum = pagination.total_pages - 2 + i;
                            } else {
                                pageNum = page - 1 + i;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    size="sm"
                                    variant={page === pageNum ? "filled" : "text"}
                                    color="blue"
                                    onClick={() => setPage(pageNum)}
                                    className="w-9 h-9"
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        size="sm"
                        variant="outlined"
                        color="blue"
                        onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                        disabled={page >= pagination.total_pages}
                        className="px-3 py-2"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Общая статистика */}
            {records.length > 0 && !loading && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <Typography variant="h6" className="text-gray-800 mb-3">
                        Umumiy statistika
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Jami qarzdorlar</div>
                            <div className="text-xl font-bold text-gray-800">{records.length} ta</div>
                        </div>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Jami to'langan</div>
                            <div className="text-xl font-bold text-green-600">
                                {formatPrice(
                                    records.reduce((sum, item) => sum + calculateTotalPaid(item.payments), 0)
                                )} so'm
                            </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Jami chegirma</div>
                            <div className="text-xl font-bold text-orange-600">
                                {formatPrice(
                                    records.reduce((sum, item) => sum + calculateTotalDiscount(item.payments), 0)
                                )} so'm
                            </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Jami qarz</div>
                            <div className="text-xl font-bold text-red-600">
                                {formatPrice(
                                    records.reduce((sum, item) => sum + (item.debt || 0), 0)
                                )} so'm
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}