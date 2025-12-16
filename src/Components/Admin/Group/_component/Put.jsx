import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { RoomApi } from "../../../../utils/Controllers/RoomApi";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";
import Edit from "../../../Other/UI/Icons/Edit";

export default function Put({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);

    const [formData, setFormData] = useState({
        school_id: Number(Cookies?.get("school_id")),
        name: "",
        price: "",
        start_date: "",
        room_id: "",
        start_time: "",
        end_time: "",
        status: true
    });

    const handleOpen = () => setOpen(!open);

    // Загружаем комнаты и подставляем старые данные
    useEffect(() => {
        if (!open) return;

        let mounted = true;

        const init = async () => {
            try {
                const res = await RoomApi.Get();
                if (!mounted) return;
                setRooms(res?.data || []);

                if (data) {
                    setFormData({
                        school_id: Number(Cookies?.get("school_id")),
                        name: data.name || "",
                        price: (data.price || "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                        start_date: data.start_date || "",
                        room_id: data.room_id != null ? String(data.room_id) : "",
                        start_time: data.start_time || "",
                        end_time: data.end_time || "",
                        status: data.status ?? true
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };

        init();

        return () => { mounted = false; };
    }, [open, data]);

    const formatPrice = (value) => {
        const onlyNums = value.replace(/\D/g, "");
        return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/\s/g, "");
        const formatted = formatPrice(raw);

        setFormData({ ...formData, price: formatted });
    };

    const EditGroup = async () => {
        try {
            setLoading(true);

            const sendData = {
                ...formData,
                price: formData.price.replace(/\s/g, ""),
                room_id: formData.room_id === "" ? null : Number(formData.room_id)
            };

            await GroupApi.Edit(formData.school_id, data?.id, sendData);

            setLoading(false);
            setOpen(false);
            refresh();

            Alert("Muvaffaqiyatli tahrirlandi!", "success");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert("Xatolik!", "error");
        }
    };

    return (
        <>
            <Tooltip content="Tahrirlash">
                <Button
                    className="bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 normal-case p-[8px]"
                    onClick={handleOpen}
                >
                    <Edit size={18} />
                </Button>
            </Tooltip>

                <Dialog open={open} handler={handleOpen} size="sm">
                    <DialogHeader>Guruhni tahrirlash</DialogHeader>

                    <DialogBody divider className="flex flex-col gap-4">

                        <Input
                            label="Guruh nomi"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />

                        <Input
                            label="Narxi"
                            value={formData.price}
                            onChange={handlePriceChange}
                        />

                        {/* Простой select с красивым стилем */}
                        <div className="w-full">
                            <label className="block text-gray-700 font-medium mb-1">Xona</label>
                            <select
                                value={formData.room_id}
                                onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                                className="
                                w-full 
                                px-4 py-3 
                                border border-gray-300 
                                rounded-xl 
                                bg-white 
                                text-gray-800
                                focus:outline-none 
                                focus:border-blue-500 
                                focus:ring-2 
                                focus:ring-blue-300
                                transition
                            "
                            >
                                <option value="">— Tanlanmagan —</option>
                                {rooms.map((r) => (
                                    <option key={r.id} value={String(r.id)}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            type="date"
                            label="Boshlanish sanasi"
                            value={formData.start_date}
                            onChange={(e) =>
                                setFormData({ ...formData, start_date: e.target.value })
                            }
                        />

                        <Input
                            type="time"
                            label="Boshlanish vaqti"
                            value={formData.start_time}
                            onChange={(e) =>
                                setFormData({ ...formData, start_time: e.target.value })
                            }
                        />

                        <Input
                            type="time"
                            label="Tugash vaqti"
                            value={formData.end_time}
                            onChange={(e) =>
                                setFormData({ ...formData, end_time: e.target.value })
                            }
                        />

                    </DialogBody>

                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={handleOpen}
                            className="mr-2"
                        >
                            Bekor qilish
                        </Button>

                        <Button
                            onClick={EditGroup}
                            disabled={loading}
                        >
                            {loading ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>
                    </DialogFooter>
                </Dialog>
            </>
            );
}
