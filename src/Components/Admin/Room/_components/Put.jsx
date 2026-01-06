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

import EditIcon from "../../../Other/UI/Icons/Edit";
import { Alert } from "../../../../utils/Alert";
import { RoomApi } from "../../../../utils/Controllers/RoomApi";

export default function Put({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [loading, setLoading] = useState(false);

    const [EditData, setEditData] = useState({
        name: data?.name || "",
        status: data?.status || "",
        school_id: Number(data?.school_id)

    });

    const EditRoom = async () => {
        setLoading(true);

        try {
            const response = await RoomApi.Edit(data?.id, EditData);

            Alert("Muvaffaqiyatli tahrirlandi!", "success");

            setOpen(false);
            refresh(); // обновляем список
        } catch (error) {
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Кнопка открыть modal */}
            <Button
                className="bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 normal-case p-[8px]"
                onClick={handleOpen}
            >
                <EditIcon size={18} />
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Xonani tahrirlash</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    {/* Room Name */}
                    <Input
                        label="Room nomi"
                        value={EditData.name}
                        onChange={(e) =>
                            setEditData({ ...EditData, name: e.target.value })
                        }
                    />

                    {/* Capacity */}
                    <Input
                        type="number"
                        label="Xona sig'imi (o‘quvchilar soni)"
                        value={EditData.status}
                        onChange={(e) =>
                            setEditData({ ...EditData, status: e.target.value })
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
                        onClick={EditRoom}
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
