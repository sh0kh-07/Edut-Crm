import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Spinner,
    Tooltip,
} from "@material-tailwind/react";

import { StudentApi } from "../../../../utils/Controllers/StudentApi";
import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";
import Edit from "../../../Other/UI/Icons/Edit";

export default function EditStudent({ data: initialData, refresh }) {
    const School_id = Number(Cookies?.get("school_id"));
    const type = Cookies?.get('type')


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({ ...initialData });

    const EditStudentData = async () => {
        setLoading(true);
        try {
            await StudentApi.Edit(School_id, data);
            Alert("O‘quvchi muvaffaqiyatli yangilandi!", "success");
            setOpen(false);
            refresh && refresh();
        } catch (error) {
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Open modal button */}
            <Tooltip content="Tahrirlash">
                <Button
                    className="bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 normal-case p-[8px]"
                    onClick={() => setOpen(true)}
                >
                    <Edit size={18} />
                </Button>
            </Tooltip>


            {/* Modal */}
            <Dialog open={open} handler={() => setOpen(false)} size="sm">
                <DialogHeader>{type === "PreSchool" ? "Bolani tahrirlash" : "Talabani tahrirlash"}</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Ota-ona ismi"
                        value={data.parents_full_name || ""}
                        onChange={(e) =>
                            setData({ ...data, parents_full_name: e.target.value })
                        }
                    />

                    <Input
                        label="Ota-ona telefon raqami"
                        value={data.parents_phone_number || ""}
                        onChange={(e) =>
                            setData({ ...data, parents_phone_number: e.target.value })
                        }
                    />

                    <Input
                        label={type === "PreSchool" ? "Bola ismi" : "Talaba ismi"}
                        value={data.full_name || ""}
                        onChange={(e) =>
                            setData({ ...data, full_name: e.target.value })
                        }
                    />

                   {type === "School" &&  

                    <Input
                        label="O‘quvchi telefon raqami"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData({ ...data, phone_number: e.target.value })
                        }
                    />
                    }
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="text"
                        className="text-black"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        className="bg-black flex items-center gap-2"
                        onClick={EditStudentData}
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
