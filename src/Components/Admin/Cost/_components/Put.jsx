import { useState, useEffect } from "react"; 
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Spinner,
    Select,
    Option
} from "@material-tailwind/react";

import EditIcon from "../../../Other/UI/Icons/Edit";
import { Alert } from "../../../../utils/Alert";
import { CostApi } from "../../../../utils/Controllers/CostApi";
import { CostCategoryApi } from "../../../../utils/Controllers/CostCategoryApi";
import Cookies from "js-cookie";

export default function Put({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const school_id = Number(Cookies?.get("school_id"));
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [EditData, setEditData] = useState({
        category_id: data?.category_id || "",
        price: data?.price || "",
        method: data?.method || "1",
        month: data?.month || "1",
        description: data?.description || "",
    });
    const GetCategories = async () => {
        try {
            const res = await CostCategoryApi.GetAll(school_id);
            setCategories(res?.data || []);
        } catch (error) {
            console.log("Category Get Error:", error);
        }
    };

    useEffect(() => {
        GetCategories();
    }, []);

    const EditCost = async () => {
        setLoading(true);
        try {
            await CostApi.Edit(school_id, data?.id, EditData);
            Alert("Xarajat muvaffaqiyatli tahrirlandi!", "success");
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
                <DialogHeader>Xarajatni tahrirlash</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Select
                        label="Kategoriya"
                        value={EditData.category_id}
                        onChange={(value) =>
                            setEditData({ ...EditData, category_id: Number(value) })
                        }
                    >
                        {categories.map((c) => (
                            <Option key={c.id} value={c.id}>
                                {c.name}
                            </Option>
                        ))}
                    </Select>

                    <Input
                        type="number"
                        label="Narx"
                        value={EditData.price}
                        onChange={(e) =>
                            setEditData({ ...EditData, price: Number(e.target.value) })
                        }
                    />

                    <Select
                        label="To‘lov metodi"
                        value={EditData.method}
                        onChange={(value) => setEditData({ ...EditData, method: value })}
                    >
                        <Option value="1">Naqd</Option>
                        <Option value="2">Karta</Option>
                        <Option value="3">Bank o'tkazma</Option>
                    </Select>

                    <Input
                        type="number"
                        label="Oy"
                        value={EditData.month}
                        onChange={(e) =>
                            setEditData({ ...EditData, month: e.target.value })
                        }
                    />

                    <Input
                        label="Izoh"
                        value={EditData.description}
                        onChange={(e) =>
                            setEditData({ ...EditData, description: e.target.value })
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
                        onClick={EditCost}
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
