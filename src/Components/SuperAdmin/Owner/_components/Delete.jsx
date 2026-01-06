import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Tooltip } from "@material-tailwind/react";
import { Alert } from "../../../../utils/Alert";
import DeleteIcon from "../../../Other/UI/Icons/DeleteIcon";
import { User } from "../../../../utils/Controllers/User";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const DeleteEmployee = async () => {
        try {
            setLoading(true);



            await User?.DeleteUser(id);

            Alert("Muvaffaqiyatli o'chirildi!", "success");
            handleOpen();
            refresh();
        } catch (error) {
            console.log(error);
            Alert("Xato!", "error");
        } finally {
            setLoading(false);
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
                    Markaz egasi o‘chirish
                </DialogHeader>

                <DialogBody className="text-gray-700 text-[15px] font-bold py-0">
                    Siz rostan ham ushbu Markaz egasini o‘chirmoqchimisiz?
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
                        onClick={DeleteEmployee}
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
