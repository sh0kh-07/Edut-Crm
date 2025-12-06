import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Spinner
} from "@material-tailwind/react";
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";
import { Payment } from "../../../../utils/Controllers/Payment";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";
import { Banknote } from "lucide-react";

export default function Create({ refresh, student_id, group_id }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [methods, setMethods] = useState([]);

    const months = [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentabr",
        "Oktabr",
        "Noyabr",
        "Dekabr"
    ];

    const [data, setData] = useState({
        school_id: Number(Cookies?.get("school_id")),
        student_id: student_id,
        group_id: group_id,
        year: new Date().getFullYear().toString(),
        month: "",
        method: "",
        discount: "",
        price: "",
        description: "",
    });

    const handleOpen = () => setOpen(!open);

    const formatPrice = (value) => {
        const num = value.replace(/\D/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const GetMethods = async () => {
        try {
            const res = await PaymentMethodApi.Get(data.school_id);
            setMethods(res?.data || []);
        } catch (error) {
            console.log("Payment Method Get Error:", error);
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
                year: String(data.year),
                price: Number(data.price.replace(/\D/g, "")),
                discount: Number(data.discount),
            });

            Alert("Muvaffaqiyatli yaratildi!", "success");
            setOpen(false);

            setData({
                school_id: Number(Cookies?.get("school_id")),
                student_id: student_id || 1,
                group_id: group_id || 1,
                year: new Date().getFullYear().toString(),
                month: "",
                method: "",
                discount: "0",
                price: "0",
                description: "",
            });

            refresh();
        } catch (error) {
            console.log(error);
            Alert(error?.response?.data?.message || "Xato yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="py-[5px] px-[10px] text-white" color="green" onClick={handleOpen}>
                <Banknote />
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>To'lov yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    {/* Oy */}
                    {/* Oy */}
                    <select
                        className="border p-2 rounded-md"
                        value={data.month}
                        onChange={(e) => setData({ ...data, month: e.target.value })}
                    >
                        <option value="">Oy tanlang</option>
                        {months.map((month, idx) => {
                            // idx начинается с 0, поэтому +1 и добавляем ведущий ноль
                            const monthNumber = (idx + 1).toString().padStart(2, "0");
                            return (
                                <option key={idx} value={monthNumber}>
                                    {month}
                                </option>
                            );
                        })}
                    </select>


                    {/* Yil */}
                    <Input
                        label="Yil"
                        type="text"
                        value={data.year}
                        onChange={(e) => setData({ ...data, year: e.target.value })}
                    />

                    {/* Narx */}
                    <Input
                        label="Narx"
                        type="text"
                        value={formatPrice(data.price)}
                        onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, "");
                            setData({ ...data, price: clean });
                        }}
                    />

                    {/* Chegirma */}
                    <Input
                        label="Chegirma (%)"
                        type="number"
                        value={data.discount}
                        onChange={(e) => setData({ ...data, discount: e.target.value })}
                    />

                    {/* Izoh */}
                    <Input
                        label="Izoh"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                    />

                    {/* To’lov usuli */}
                    <select
                        className="border p-2 rounded-md"
                        value={data.method}
                        onChange={(e) => setData({ ...data, method: e.target.value })}
                    >
                        <option value="">To'lov usuli</option>
                        {methods.map((m) => (
                            <option key={m.id} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>

                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button variant="text" onClick={handleOpen} disabled={loading}>
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
