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
    Spinner,
} from "@material-tailwind/react";

import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";
import { SalaryApi } from "../../../../utils/Controllers/Salary";
import { Employee } from "../../../../utils/Controllers/Employee";
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
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

    const school_id = Number(Cookies.get("school_id"));
    const currentYear = new Date().getFullYear();

    const [data, setData] = useState({
        school_id: school_id,
        teacher_id: "",
        price: "",
        method: "",
        month: "",
        description: "",
        year: currentYear,
    });

    const handleOpen = () => setOpen(!open);

    const getTeachers = async () => {
        try {
            const res = await Employee.GetBySchoolId(school_id);
            setTeachers(res?.data || []);
        } catch (error) {
            console.log("Teacher fetch error:", error);
        }
    };

    const getMethods = async () => {
        try {
            const res = await PaymentMethodApi.Get(school_id); 
            setMethods(res?.data || []);
        } catch (error) {
            console.log("Method fetch error:", error);
        }
    };

    useEffect(() => {
        if (open) {
            getTeachers();
            getMethods();
        }
    }, [open]);

    const CreateSalaryFunc = async () => {
        try {
            setLoading(true);

            const sendData = {
                school_id: data.school_id,
                teacher_id: Number(data.teacher_id),
                price: Number(data.price),
                method: String(data.method),
                month: String(data.month),
                description: data.description,
                year: String(data.year),
            };

            await SalaryApi.Create(sendData);

            Alert("Oylik to‘lov muvaffaqiyatli yaratildi!", "success");
            setOpen(false);
            setData({ ...data, teacher_id: "", price: "", method: "", month: "", description: "" });
            refresh();
        } catch (error) {
            console.log("Salary create error:", error);
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="bg-black text-white" onClick={handleOpen}>
                + Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Oylik to‘lov yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
<Select
    label="O‘qituvchi"
    value={data.teacher_id}
    onChange={(val) => setData({ ...data, teacher_id: val })}
>
    {teachers.map((t) => (
        <Option key={t.id} value={t.id}>
            {t.full_name} 
        </Option>
    ))}
</Select>

<Select
    label="To‘lov usuli"
    value={data.method}
    onChange={(val) => setData({ ...data, method: val })}
>
    {methods.map((m) => (
        <Option key={m.id} value={m.name}> 
            {m.name}
        </Option>
    ))}
</Select>


                   <Select
    label="Oy"
    value={data.month}
    onChange={(val) => setData({ ...data, month: val })}
>
    {months.map((month, index) => (
        <Option key={index + 1} value={index + 1}>
            {month}
        </Option>
    ))}
</Select>

                    <Input
                        type="number"
                        label="Narx"
                        value={data.price}
                        onChange={(e) => setData({ ...data, price: e.target.value })}
                    />

                 <Select
    label="To‘lov usuli"
    value={data.method}
    onChange={(val) => setData({ ...data, method: val })}
>
    {methods.map((m) => (
        <Option key={m.id} value={m.name}>
            {m.name}
        </Option>
    ))}
</Select>


                    <Input
                        label="Izoh"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                    />
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button variant="text" color="gray" onClick={handleOpen} disabled={loading}>
                        Bekor qilish
                    </Button>
                    <Button
                        className="bg-black text-white flex items-center justify-center gap-2"
                        onClick={CreateSalaryFunc}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" /> Yaratilmoqda...
                            </div>
                        ) : (
                            "Yaratish"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
