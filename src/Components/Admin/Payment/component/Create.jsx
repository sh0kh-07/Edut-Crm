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
import { Banknote } from "lucide-react";

export default function Create({ refresh, student_id, group_id }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [methods, setMethods] = useState([]);
    const [discountType, setDiscountType] = useState("percent"); // percent | sum

    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    const [data, setData] = useState({
        school_id: Number(Cookies?.get("school_id")),
        student_id,
        group_id,
        year: new Date().getFullYear().toString(),
        month: "",
        method: "",
        price: "",        // ОБЩАЯ СУММА
        discount: "",     // %
        discountSum: "",  // сумма
        description: "",
    });

    const handleOpen = () => setOpen(!open);

    const formatPrice = (value) => {
        if (!value) return "";
        const num = value.toString().replace(/\D/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    /* ================== ИТОГОВАЯ СУММА ================== */
    const finalPrice = useMemo(() => {
        const price = Number(data.price || 0);
        if (!price) return 0;

        if (discountType === "percent") {
            const percent = Number(data.discount || 0);
            return Math.max(price - (price * percent) / 100, 0);
        }

        const sum = Number(data.discountSum || 0);
        return Math.max(price - sum, 0);
    }, [data.price, data.discount, data.discountSum, discountType]);

    /* ==================================================== */

    const GetMethods = async () => {
        try {
            const res = await PaymentMethodApi.Get(data.school_id);
            setMethods(res?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) GetMethods();
    }, [open]);

    const CreatePayment = async () => {
        setLoading(true);
        try {
            await Payment.Create({
                ...data,
                price: finalPrice, // 🔥 ОТПРАВЛЯЕМ УЖЕ ИТОГ
                discount:
                    discountType === "percent"
                        ? Number(data.discount)
                        : 0,
                discountSum:
                    discountType === "sum"
                        ? Number(data.discountSum)
                        : 0,
            });

            Alert("Muvaffaqiyatli yaratildi!", "success");
            setOpen(false);
            refresh();
        } catch (error) {
            Alert("Xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button color="green" className="px-[8px] py-[5px]" onClick={handleOpen}>
                <Banknote />
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>To'lov yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    {/* Oy */}
                    <select
                        className="border p-2 rounded-md"
                        value={data.month}
                        onChange={(e) =>
                            setData({ ...data, month: e.target.value })
                        }
                    >
                        <option value="">Oy tanlang</option>
                        {months.map((m, i) => (
                            <option
                                key={i}
                                value={(i + 1).toString().padStart(2, "0")}
                            >
                                {m}
                            </option>
                        ))}
                    </select>

                    {/* Yil */}
                    <Input
                        label="Yil"
                        value={data.year}
                        onChange={(e) =>
                            setData({ ...data, year: e.target.value })
                        }
                    />

                    {/* Общая сумма */}
                    <Input
                        label="Umumiy summa"
                        value={formatPrice(data.price)}
                        onChange={(e) =>
                            setData({
                                ...data,
                                price: e.target.value.replace(/\D/g, ""),
                            })
                        }
                    />

                    {/* КНОПКИ СКИДКИ */}
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            color={discountType === "percent" ? "blue" : "gray"}
                            onClick={() => {
                                setDiscountType("percent");
                                setData({ ...data, discountSum: "" });
                            }}
                        >
                            %
                        </Button>

                        <Button
                            className="flex-1"
                            color={discountType === "sum" ? "blue" : "gray"}
                            onClick={() => {
                                setDiscountType("sum");
                                setData({ ...data, discount: "" });
                            }}
                        >
                            So'm
                        </Button>
                    </div>

                    {/* Скидка % */}
                    {discountType === "percent" && (
                        <Input
                            label="Chegirma (%)"
                            type="number"
                            value={data.discount}
                            onChange={(e) =>
                                setData({ ...data, discount: e.target.value })
                            }
                        />
                    )}

                    {/* Скидка сумма */}
                    {discountType === "sum" && (
                        <Input
                            label="Chegirma summasi"
                            value={formatPrice(data.discountSum)}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    discountSum: e.target.value.replace(/\D/g, ""),
                                })
                            }
                        />
                    )}

                    {/* 🔥 ИТОГ */}
                    <div className="text-right font-semibold text-green-600">
                        Yakuniy summa: {formatPrice(finalPrice.toString())} so'm
                    </div>

                    {/* Izoh */}
                    <Input
                        label="Izoh"
                        value={data.description}
                        onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                        }
                    />

                    {/* Method */}
                    <select
                        className="border p-2 rounded-md"
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
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
