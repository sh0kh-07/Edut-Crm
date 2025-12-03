import { useState, useEffect } from "react";
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
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";
import { Payment } from "../../../../utils/Controllers/Payment";

import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";

export default function Create({ refresh, student_id, group_id }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [methods, setMethods] = useState([]);
const [students, setStudents] = useState([]);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [data, setData] = useState({
        school_id: Number(Cookies?.get("school_id")),
        student_id: student_id || 1,
        group_id: group_id || 1,
        year: new Date().getFullYear().toString(),
        month: "",
        method: "",
        discount: 0, 
        price: 0, 
        description: "",
    });

    const handleOpen = () => setOpen(!open);

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
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await GroupApi.GetStudents(group_id);
      setStudents(res?.data || []);
      if (!res?.data.find(s => s.id === student_id)) {
        setData({ ...data, student_id: res?.data[0]?.id || null }); 
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchStudents();
}, [group_id]);
    const CreatePayment = async () => {
        setLoading(true);
        try {
            await Payment.Create({
                ...data,
                year: String(data.year),
                price: parseInt(data.price),
                discount: parseInt(data.discount),
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
                discount: 0,
                price: 0,
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
            <Button className="bg-black text-white" onClick={handleOpen}>
                +
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>To'lov yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Select
                        label="Oy"
                        value={data.month}
                        onChange={(value) => setData({ ...data, month: value })}
                    >
                        {months.map((month, idx) => (
                            <Option key={idx} value={month}>
                                {month}
                            </Option>
                        ))}
                    </Select>

                    <Input
                        label="Yil"
                        type="text" 
                        value={data.year}
                        onChange={(e) => setData({ ...data, year: e.target.value })}
                    />

                    <Input
                        label="Narx"
                        type="number"
                        value={data.price}
                        onChange={(e) => setData({ ...data, price: e.target.value })}
                    />

                    <Input
                        label="Chegirma (%)"
                        type="number"
                        value={data.discount}
                        onChange={(e) => setData({ ...data, discount: e.target.value })}
                    />

                    <Input
                        label="Izoh"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                    />

                    <Select
                        label="To'lov usuli"
                        value={data.method}
                        onChange={(value) => setData({ ...data, method: value })}
                    >
                        {methods.map((m) => (
                            <Option key={m.id} value={m.name}>
                                {m.name}
                            </Option>
                        ))}
                    </Select>
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
