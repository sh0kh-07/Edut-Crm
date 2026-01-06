import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { RoomApi } from "../../../../utils/Controllers/RoomApi";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);

    const [data, setData] = useState({
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

    const getRoom = async () => {
        try {
            const res = await RoomApi.Get(Cookies?.get("school_id"));
            setRooms(res?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) getRoom();
    }, [open]);

    // формат цены
    const formatPrice = (value) => {
        const onlyNums = value.replace(/\D/g, "");
        return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/\s/g, "");
        setData({ ...data, price: formatPrice(raw) });
    };

    const CreateGroup = async () => {
        try {
            setLoading(true);

            await GroupApi.Create({
                ...data,
                price: data.price.replace(/\s/g, "")
            });

            setOpen(false);
            refresh();
            Alert("Muvaffaqiyatli yaratildi!", "success");

            setData({
                school_id: Number(Cookies?.get("school_id")),
                name: "",
                price: "",
                start_date: "",
                room_id: "",
                start_time: "",
                end_time: "",
                status: true
            });
        } catch (error) {
            Alert("Xato!", "error");
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
                <DialogHeader>Guruh yaratish</DialogHeader>

                <DialogBody divider className="flex flex-col gap-4">

                    <Input
                        label="Guruh nomi"
                        value={data.name}
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                    />

                    <Input
                        label="Narxi"
                        value={data.price}
                        onChange={handlePriceChange}
                    />

                    <Input
                        type="date"
                        label="Boshlanish sanasi"
                        value={data.start_date}
                        onChange={(e) =>
                            setData({ ...data, start_date: e.target.value })
                        }
                    />

                    {/* ✅ ПРОСТОЙ SELECT */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            Xona
                        </label>
                        <select
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black"
                            value={data.room_id}
                            onChange={(e) =>
                                setData({ ...data, room_id: Number(e.target.value) })
                            }
                        >
                            <option value="">Xonani tanlang</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        type="time"
                        label="Boshlanish vaqti"
                        value={data.start_time}
                        onChange={(e) =>
                            setData({ ...data, start_time: e.target.value })
                        }
                    />

                    <Input
                        type="time"
                        label="Tugash vaqti"
                        value={data.end_time}
                        onChange={(e) =>
                            setData({ ...data, end_time: e.target.value })
                        }
                    />

                </DialogBody>

                <DialogFooter>
                    <Button variant="text" onClick={handleOpen}>
                        Bekor qilish
                    </Button>

                    <Button
                        className="bg-black text-white"
                        onClick={CreateGroup}
                        disabled={loading}
                    >
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
