import { useState, useEffect, useMemo } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";
import { Payment } from "../../../../utils/Controllers/Payment";
import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";
import { Banknote, Receipt } from "lucide-react";

export default function Create({ refresh, student_id, group_id, price }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [methods, setMethods] = useState([]);
    const [discountType, setDiscountType] = useState("sum"); // sum | percent

    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    const [data, setData] = useState({
        school_id: Number(Cookies.get("school_id")),
        student_id,
        group_id,
        year: new Date().getFullYear().toString(),
        month: "",
        method: "",
        price: price,
        discount: 0,
        discountSum: 0,
        paid: "",
        description: "",
    });

    const handleOpen = () => setOpen(!open);

    const format = (v) =>
        v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";

    /* ================= РАСЧЁТ ================= */
    const calculatedDiscountSum = useMemo(() => {
        if (discountType === "percent") {
            return Math.floor(
                (Number(data.price) * Number(data.discount || 0)) / 100
            );
        }
        return Number(data.discountSum || 0);
    }, [discountType, data.discount, data.discountSum, data.price]);

    const finalprice = useMemo(() => {
        return Math.max(
            Number(data.price) - calculatedDiscountSum,
            0
        );
    }, [data.price, calculatedDiscountSum]);

    const debt = useMemo(() => {
        return Math.max(
            finalprice - Number(data.paid || 0),
            0
        );
    }, [finalprice, data.paid]);

    const selectedMonthName = useMemo(() => {
        if (!data.month) return "Tanlanmagan";
        const monthIndex = parseInt(data.month) - 1;
        return months[monthIndex] || "Tanlanmagan";
    }, [data.month]);

    /* ========================================= */

    const GetMethods = async () => {
        const res = await PaymentMethodApi.Get(data.school_id);
        setMethods(res?.data || []);
    };

    useEffect(() => {
        if (open) GetMethods();
    }, [open]);

    const CreatePayment = async () => {
        setLoading(true);
        try {
            const paymentData = {
                school_id: data.school_id,
                student_id: data.student_id,
                group_id: data.group_id,
                year: data.year,
                month: data.month, // Номер месяца в строковом формате (например: "9")
                method: data.method,
                discount: discountType === "percent" ? Number(data.discount) : 0,
                discountSum: discountType === "sum" ? Number(calculatedDiscountSum) : 0,
                price: Number(data.paid), // Сумма оплаты
                description: data.description,
            };


            await Payment.Create(paymentData);

            Alert("To'lov muvaffaqiyatli!", "success");
            setOpen(false);
            refresh();
        } catch (e) {
            console.error("Ошибка при создании платежа:", e);
            Alert("Xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button color="green" className="px-[5px] py-[5px]" onClick={handleOpen}>
                <Banknote />
            </Button>

            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    To'lov qo'shish
                </DialogHeader>

                <DialogBody>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Левая часть - Форма */}
                        <div className="lg:w-1/2 space-y-4">
                            {/* Цена курса */}
                            <Input
                                label="Kurs narxi"
                                value={format(data.price)}
                                disabled
                            />

                            {/* Переключатель скидки */}
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    color={discountType === "sum" ? "blue" : "gray"}
                                    onClick={() => {
                                        setDiscountType("sum");
                                        setData({ ...data, discount: 0 });
                                    }}
                                >
                                    So'm
                                </Button>
                                <Button
                                    className="flex-1"
                                    color={discountType === "percent" ? "blue" : "gray"}
                                    onClick={() => {
                                        setDiscountType("percent");
                                        setData({ ...data, discountSum: 0 });
                                    }}
                                >
                                    %
                                </Button>
                            </div>

                            {/* Скидка сумма */}
                            {discountType === "sum" && (
                                <Input
                                    label="Chegirma (so'm)"
                                    value={format(data.discountSum)}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            discountSum: e.target.value.replace(/\D/g, "")
                                        })
                                    }
                                />
                            )}

                            {/* Скидка процент */}
                            {discountType === "percent" && (
                                <Input
                                    label="Chegirma (%)"
                                    type="number"
                                    value={data.discount}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            discount: e.target.value
                                        })
                                    }
                                />
                            )}

                            {/* Платит сейчас */}
                            <Input
                                label="Hozir to'lanadi"
                                value={format(data.paid)}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        paid: e.target.value.replace(/\D/g, "")
                                    })
                                }
                            />

                            {/* Oy - сохраняем номер месяца */}
                            <select
                                className="border p-2 rounded-md w-full"
                                value={data.month}
                                onChange={(e) =>
                                    setData({ ...data, month: e.target.value })
                                }
                            >
                                <option value="">Oy tanlang</option>
                                {months.map((m, i) => (
                                    <option key={i} value={String(i + 1)}>
                                        {m}
                                    </option>
                                ))}
                            </select>

                            {/* Method */}
                            <select
                                className="border p-2 rounded-md w-full"
                                value={data.method}
                                onChange={(e) =>
                                    setData({ ...data, method: e.target.value })
                                }
                            >
                                <option value="">To'lov usuli</option>
                                {methods.map((m) => (
                                    <option key={m.id} value={m.name}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>

                            <Input
                                label="Izoh"
                                value={data.description}
                                onChange={(e) =>
                                    setData({ ...data, description: e.target.value })
                                }
                            />
                        </div>

                        {/* Правая часть - Чек */}
                        <div className="lg:w-1/2">
                            <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6">
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Receipt className="h-8 w-8 text-blue-600" />
                                        <h3 className="text-2xl font-bold text-gray-800">TO'LOV CHEKI</h3>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date().toLocaleDateString('uz-UZ')} | {new Date().toLocaleTimeString('uz-UZ')}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-t border-b border-gray-200 py-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600">Kurs narxi:</span>
                                            <div className="flex items-center gap-[2px] flex-col text-right">
                                                {/* Полная цена */}
                                                {Number(data.price) !== Number(finalprice) ? (
                                                    <span className="text-gray-500 line-through">{format(data.price)} so'm</span>
                                                ) : (
                                                    <span className="font-semibold">{format(data.price)} so'm</span>
                                                )}

                                                {/* Итоговая цена */}
                                                <span className="font-semibold text-green-600">{format(finalprice)} so'm</span>
                                            </div>
                                        </div>

                                        {discountType === "sum" && data.discountSum > 0 && (
                                            <div className="flex justify-between items-center text-red-600">
                                                <span>Chegirma ({format(data.discountSum)} so'm):</span>
                                                <span className="font-semibold">-{format(calculatedDiscountSum)} so'm</span>
                                            </div>
                                        )}

                                        {discountType === "percent" && data.discount > 0 && (
                                            <div className="flex justify-between items-center text-red-600">
                                                <span>Chegirma ({data.discount}%):</span>
                                                <span className="font-semibold">-{format(calculatedDiscountSum)} so'm</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center text-green-600 font-semibold">
                                        <span>To'langan:</span>
                                        <span>+{format(data.paid || 0)} so'm</span>
                                    </div>

                                    <div className="flex justify-between items-center text-red-600 font-semibold">
                                        <span>Qarz:</span>
                                        <span>{format(debt)} so'm</span>
                                    </div>

                                    <div className="mt-6 space-y-3 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Oy:</span>
                                            <span className="font-medium">
                                                {data.month ? months[parseInt(data.month) - 1] : "Tanlanmagan"} {data.year}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>To'lov usuli:</span>
                                            <span className="font-medium">{data.method || "Tanlanmagan"}</span>
                                        </div>

                                        {data.description && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-gray-600 mb-1">Izoh:</div>
                                                <div className="font-medium">{data.description}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button variant="text" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button
                        className="bg-black text-white"
                        onClick={CreatePayment}
                        disabled={loading}
                    >
                        {loading ? "Saqlanmoqda..." : "To'lovni saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}