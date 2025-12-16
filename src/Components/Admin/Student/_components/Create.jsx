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

import { StudentApi } from "../../../../utils/Controllers/StudentApi";
import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";

export default function Create({ refresh }) {
    const School_id = Number(Cookies?.get("school_id"));
    const type = Cookies?.get('type')


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        school_id: School_id,
        parents_full_name: "",
        parents_phone_number: "+998",
        full_name: "",
        phone_number: "+998",
        status: true,
    });

    const CreateStudent = async () => {
        setLoading(true);

        try {
            await StudentApi.Create(data);
            Alert("O‘quvchi muvaffaqiyatli yaratildi!", "success");
            setOpen(false);

            // Очистка полей
            setData({
                school_id: School_id,
                parents_full_name: "",
                parents_phone_number: "+998",
                full_name: "",
                phone_number: "+998",
                status: true,
            });

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
            <Button className="bg-black" onClick={() => setOpen(true)}>
                + Yaratish
            </Button>

            <Dialog open={open} handler={() => setOpen(false)} size="sm">
                <DialogHeader>{type === "PreSchool" ? "Bola yaratish" : "Talaba yaratish"}</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Ota-ona ismi"
                        value={data.parents_full_name}
                        onChange={(e) =>
                            setData({ ...data, parents_full_name: e.target.value })
                        }
                    />

                    <Input
                        label="Ota-ona telefon raqami"
                        value={data.parents_phone_number}
                        onChange={(e) =>
                            setData({ ...data, parents_phone_number: e.target.value })
                        }
                    />

                    <Input
                        label={type === "PreSchool" ? "Bola ismi" : "Talaba ismi"}
                        value={data.full_name}
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
                        onClick={CreateStudent}
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
