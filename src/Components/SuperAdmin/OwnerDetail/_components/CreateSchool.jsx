import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { School } from "../../../../utils/Controllers/SchoolApi";
import { Alert } from "../../../../utils/Alert";
import { useParams } from "react-router-dom";

export default function CreateSchool({ refresh }) {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [type, setType] = useState(""); // School или PreSchool
    const [loading, setLoading] = useState(false);
    const [Price, setPrice] = useState('');

    const handleOpen = () => setOpen(!open);

    const handleCreateSchool = async () => {
        if (!type) {
            return Alert("Iltimos, markaz turini tanlang!", "error");
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("address", address);
            formData.append("owner_id", id);
            formData.append("price", Price);
            formData.append("type", type); // добавляем тип
            if (image) formData.append("image", image);

            await School?.CreateSchool(formData);

            setOpen(false);
            Alert("Muvaffaqiyatli!", "success");
            // Очистка
            setName("");
            setAddress("");
            setImage(null);
            setType("");
            setPrice('')
            refresh()
        } catch (error) {
            console.log(error);
            Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpen}>Markaz yaratish</Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Yangi Markaz yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Markaz nomi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Manzil"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <Input
                        label="Narxi"
                        value={Price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    {/* Тип Markaz */}
                    <div>
                        <Typography className="text-sm mb-1">Markaz turi</Typography>
                        <Select
                            value={type}
                            onChange={(val) => setType(val)}
                            label="Markaz turi"
                        >
                            <Option value="School">School</Option>
                            <Option value="PreSchool">PreSchool</Option>
                        </Select>
                    </div>

                    {/* File input */}
                    <div>
                        <Typography className="text-sm mb-1">
                            Rasm / Logo
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button variant="text" onClick={handleOpen}>
                        Bekor qilish
                    </Button>

                    <Button
                        color="blue"
                        onClick={handleCreateSchool}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Yaratilmoqda...
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
