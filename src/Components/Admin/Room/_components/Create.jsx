import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Spinner,
} from "@material-tailwind/react";

import { Alert } from "../../../../utils/Alert";
import { RoomApi } from "../../../../utils/Controllers/RoomApi";
import Cookies from "js-cookie";


export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        status: "", // вместимость
        school_id:Number(Cookies.get("school_id"))
    });

    const CreateRoom = async () => {
        setLoading(true);

        try {
            const response = await RoomApi.Create(data);
            Alert("Muvaffaqiyatli!", "success");

            setOpen(false);
            setData({ name: "", status: "" });
            refresh()
        } catch (error) {
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Открыть модал */}
            <Button className="bg-black" onClick={handleOpen}>
                Yaratish
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Xona yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    {/* Name */}
                    <Input
                        label="Room nomi"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />

                    {/* Вместимость */}
                    <Input
                        type="number"
                        label="Xona sig'imi (o‘quvchilar soni)"
                        value={data.status}
                        onChange={(e) => setData({ ...data, status: e.target.value })}
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
                        onClick={CreateRoom}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" /> Yaratilmoqda...
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
