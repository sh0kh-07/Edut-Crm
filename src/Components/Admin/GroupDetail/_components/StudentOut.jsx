import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { Alert } from "../../../../utils/Alert";
import DeleteIcon from "../../../Other/UI/Icons/DeleteIcon";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";

export default function StudentOut({ id, refresh, }) {


    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const DeleteEmployee = async () => {
        try {
            await GroupApi?.StudentOut(id);
            Alert("Muvaffaqiyatli!", "success");
            handleOpen();
            refresh();
        } catch (error) {
            console.log(error);
            Alert("Xato!", "error");
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
                    O'quvchini guruhdan chiqarish
                </DialogHeader>

                <DialogBody className="text-gray-700 text-[15px] font-bold py-0">
                    Siz rostdan ham ushbu o'quvchini guruhdan chiqarmoqchimisiz?
                </DialogBody>

                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="text"
                        className="normal-case"
                        onClick={handleOpen}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        className="bg-red-600 text-white hover:bg-red-700 normal-case"
                        onClick={DeleteEmployee}
                    >
                        Ha, o‘chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
