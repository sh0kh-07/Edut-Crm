import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
} from "@material-tailwind/react";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";
import { CostApi } from "../../../../utils/Controllers/CostApi";
import { CostCategoryApi } from "../../../../utils/Controllers/CostCategoryApi";
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [methods, setMethods] = useState([]);

    const [data, setData] = useState({
        school_id: Number(Cookies.get("school_id")),
        category_id: "",
        price: "",
        method: "",
        month: "",
        description: ""
    });

    const handleOpen = () => setOpen(!open);

    // CATEGORY GET
    const getCategories = async () => {
        try {
            const res = await CostCategoryApi.Get(data.school_id);
            setCategories(res?.data || []);
        } catch (error) {
            console.log("Category error:", error);
        }
    };

    // PAYMENT METHOD GET
    const getMethods = async () => {
        try {
            const res = await PaymentMethodApi.Get(data.school_id);
            setMethods(res?.data || []);
        } catch (error) {
            console.log("Payment method error:", error);
        }
    };

    useEffect(() => {
        if (open) {
            getCategories();
            getMethods();
        }
    }, [open]);

    const formatPrice = (value) => {
        const clean = value.replace(/\D/g, "");
        return clean.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/\s/g, "");
        setData({ ...data, price: formatPrice(raw) });
    };

    const CreateCostFunc = async () => {
        try {
            setLoading(true);

            const sendData = {
                school_id: data.school_id,
                category_id: Number(data.category_id),
                price: Number(data.price.replace(/\s/g, "")),
                method: String(data.method),
                month: String(data.month),
                description: data.description
            };

            await CostApi.Create(sendData);

            setLoading(false);
            setOpen(false);
            refresh();
            Alert("Xarajat muvaffaqiyatli yaratildi!", "success");

            setData({
                school_id: Number(Cookies.get("school_id")),
                category_id: "",
                price: "",
                method: "",
                month: "",
                description: ""
            });

        } catch (error) {
            console.log("Cost create error:", error);
            setLoading(false);
            Alert(error?.response?.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <>
            <Button className="bg-black text-white" onClick={handleOpen}>
                + Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Xarajat yaratish</DialogHeader>

                <DialogBody divider className="flex flex-col gap-4">

                    <Select
                        label="Xarajat turi (Kategoriya)"
                        value={String(data.category_id)}
                        onChange={(value) => setData({ ...data, category_id: value })}
                    >
                        {categories.map((cat) => (
                            <Option key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>

                    <Input
                        label="Narx"
                        value={data.price}
                        onChange={handlePriceChange}
                    />

                    <Select
                        label="To‘lov turi"
                        value={String(data.method)}
                        onChange={(val) => setData({ ...data, method: val })}
                    >
                        {methods.map((m) => (
                            <Option key={m.id} value={m.name}>
                                {m.name}
                            </Option>
                        ))}
                    </Select>

                    {/* MONTH */}
                    <Select
                        label="Oy"
                        value={String(data.month)}
                        onChange={(val) => setData({ ...data, month: val })}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <Option key={i + 1} value={String(i + 1)}>
                                {i + 1}-oy
                            </Option>
                        ))}
                    </Select>

                    <Input
                        label="Izoh"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                    />
                </DialogBody>

                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button
                        className="bg-black text-white"
                        onClick={CreateCostFunc}
                        disabled={loading}
                    >
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
