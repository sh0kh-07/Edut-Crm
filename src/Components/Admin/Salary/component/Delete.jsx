import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { Alert } from "../../../../utils/Alert";
import DeleteIcon from "../../../Other/UI/Icons/DeleteIcon";
import Cookies from "js-cookie";
import { SalaryApi } from "../../../../utils/Controllers/Salary";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    console.log("Deleting salary with id:", id, "school_id:", Cookies.get("school_id"));
    try {
        await SalaryApi.Delete({ school_id: Cookies.get("school_id"), id });
        Alert("Oylik muvaffaqiyatli o'chirildi!", "success");
        refresh();
    } catch (error) {
        console.log(error.response?.data || error);
        Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
    }
};

    return (
        <>
            {/* Delete Button */}
            <Button
                onClick={handleOpen}
                className="bg-red-600 text-white hover:bg-red-700 active:bg-red-800 normal-case p-[8px] transition-colors duration-200"
            >
                <DeleteIcon size={18} />
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="xs">
                <DialogHeader className="text-lg font-semibold flex items-center gap-2">
                    Oylik to‘lovni o‘chirish
                </DialogHeader>

                <DialogBody className="text-gray-700 text-[15px] font-bold py-0">
                    Siz rostdan ham ushbu oylik to‘lovni o‘chirmoqchimisiz?
                </DialogBody>

                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="text"
                        className="normal-case"
                        onClick={handleOpen}
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        className="bg-red-600 text-white hover:bg-red-700 normal-case flex items-center gap-2"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {loading ? "O‘chirilmoqda..." : "Ha, o‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
