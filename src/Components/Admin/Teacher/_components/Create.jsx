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

import { Employee } from "../../../../utils/Controllers/Employee";
import { Alert } from "../../../../utils/Alert";
import Cookies from "js-cookie";


export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const type = Cookies?.get('type')


    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        school_id: Number(Cookies?.get('school_id')),
        full_name: "",
        phone_number: "+998",
        login: "",
        password: "",
        role: "teacher",
        salary: "",
    });

    const CreateEmployee = async () => {
        setLoading(true);

        try {
            const response = await Employee.CreateEmployee(data);
            Alert("Ustoz muvaffaqiyatli yaratildi!", "success");

            setOpen(false);
            refresh && refresh();
            setData({
                full_name: "",
                phone_number: "",
                login: "",
                password: "",
                role: "teacher",
                salary: "",
            });
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
            <Button className="bg-black" onClick={handleOpen}>
                + Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader> {type === 'PreSchool' ? "Tarbiyachi yaratihs" : "Ustoz yaratish"} </DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    <Input
                        label="Ism familiya"
                        value={data.full_name}
                        onChange={(e) =>
                            setData({ ...data, full_name: e.target.value })
                        }
                    />

                    <Input
                        label="Telefon raqam"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData({ ...data, phone_number: e.target.value })
                        }
                    />

                    <Input
                        label="Login"
                        value={data.login}
                        onChange={(e) =>
                            setData({ ...data, login: e.target.value })
                        }
                    />

                    <Input
                        type="password"
                        label="Parol"
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />

                    <Input
                        type="number"
                        label="Maosh"
                        value={data.salary}
                        onChange={(e) =>
                            setData({ ...data, salary: e.target.value })
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
                        className="bg-black flex items-center gap-2"
                        onClick={CreateEmployee}
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
