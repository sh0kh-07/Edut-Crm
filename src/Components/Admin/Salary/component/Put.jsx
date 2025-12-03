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
import EditIcon from "../../../Other/UI/Icons/Edit";
import { Alert } from "../../../../utils/Alert";
import { SalaryApi } from "../../../../utils/Controllers/Salary";
import { Employee } from "../../../../utils/Controllers/Employee";
import { PaymentMethodApi } from "../../../../utils/Controllers/PaymentMethodApi";
import Cookies from "js-cookie";

export default function Put({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [loading, setLoading] = useState(false);

    const [editData, setEditData] = useState({
        teacher_id: data?.teacher_id || "",
        price: data?.price || "",
        method: data?.method || "",
        month: data?.month || "",
        description: data?.description || "",
    });

    const [teachers, setTeachers] = useState([]); 
    const [methods, setMethods] = useState([]);

    const school_id = Number(Cookies.get("school_id"));
    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const teacherRes = await Employee.GetBySchoolId(school_id);
                    setTeachers(teacherRes?.data || []);

                    const methodRes = await PaymentMethodApi.Get(school_id);
                    setMethods(methodRes?.data || []);
                } catch (err) {
                    console.log(err);
                }
            };
            fetchData();
        }
    }, [open, school_id]);

    const updateSalary = async () => {
        setLoading(true);
        try {
            await SalaryApi.Update({
                school_id: data.school_id,
                id: data.id,
                data: editData,
            });
            Alert("Oylik muvaffaqiyatli tahrirlandi!", "success");
            setOpen(false);
            refresh();
        } catch (error) {
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                className="bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 normal-case p-[8px]"
                onClick={handleOpen}
            >
                <EditIcon size={18} />
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Oylik tahrirlash</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    {/* O‘qituvchi select */}
                    <Select
                        label="O‘qituvchi"
                        value={editData.teacher_id}
                        onChange={(val) => setEditData({ ...editData, teacher_id: val })}
                    >
                        {teachers.map((t) => (
                            <Option key={t.id} value={t.id}>
                                {t.full_name || t.name}
                            </Option>
                        ))}
                    </Select>

                    {/* Miqdor */}
                    <Input
                        type="number"
                        label="Miqdor (so‘m)"
                        value={editData.price}
                        onChange={(e) =>
                            setEditData({ ...editData, price: Number(e.target.value) })
                        }
                    />

                    {/* To‘lov usuli select */}
                    <Select
                        label="To‘lov usuli"
                        value={editData.method}
                        onChange={(val) => setEditData({ ...editData, method: val })}
                    >
                        {methods.map((m) => (
                            <Option key={m.id} value={m.name}>
                                {m.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
    label="Oy"
    value={editData.month}
    onChange={(val) => setEditData({ ...editData, month: val })}
>
    {months.map((name) => (
        <Option key={name} value={name}>
            {name}
        </Option>
    ))}
</Select>


                    {/* Izoh */}
                    <Input
                        label="Izoh"
                        value={editData.description}
                        onChange={(e) =>
                            setEditData({ ...editData, description: e.target.value })
                        }
                    />
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="text"
                        className="text-black"
                        onClick={handleOpen}
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        className="bg-black flex items-center justify-center gap-2"
                        onClick={updateSalary}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" /> Saqlanmoqda...
                            </div>
                        ) : (
                            "Saqlash"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
