import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Tooltip
} from "@material-tailwind/react";
import { Plus } from "lucide-react";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";

export default function Add({ student, refresh }) {
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);



    const GetGroups = async () => {
        try {
            const response = await GroupApi.GetAll(Number(Cookies?.get("school_id")));
            if (response && response.data) {
                // ID групп, где студент уже состоит (берём group_id)
                const studentGroupIds = student?.group?.map(g => g.group_id) || [];

                // Оставляем только группы, которых нет у студента
                const availableGroups = response.data.filter(
                    (group) => !studentGroupIds.includes(group.id)
                );

                setGroups(availableGroups);
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (open) {
            GetGroups();
        }
    }, [student, open]);

    const AddToGroup = async () => {
        if (!selectedGroup) return;

        setLoading(true);
        try {
            const selectedGroupData = groups.find(g => g.id === Number(selectedGroup));

            const data = {
                student_id: student.id,
                group_id: Number(selectedGroup),
                group_name: selectedGroupData?.name || ""
            };

            const response = await GroupApi?.Add(data);
            if (response) {
                setOpen(false);
                setSelectedGroup("");
                Alert("Muvaffaqiyatli!", "success");
                refresh();
            }
        } catch (error) {
            console.log(error);
            Alert("Xato!", "error");
        } finally {
            setLoading(false);
        }
    };

    const currentGroups = student?.group?.map(g => g.group_name).join(", ") || "Guruh yo'q";

    return (
        <>
            <Tooltip content="Guruhga qo`shish">
                <Button
                    onClick={handleOpen}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 normal-case p-2 rounded-lg shadow-sm"
                >
                    <Plus size={18} />
                </Button>
            </Tooltip>


            <Dialog open={open} handler={handleOpen} size="sm" className="rounded-lg">
                <DialogHeader className="text-lg font-semibold text-gray-800">
                    O'quvchini guruhga qo'shish
                </DialogHeader>

                <DialogBody className="space-y-4 py-4">
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-700 font-medium">{student?.full_name}</p>
                        <p className="text-gray-600 text-sm">
                            Telefon: {student?.phone_number}
                        </p>
                        <p className="text-gray-600 text-sm">
                            Joriy guruhlar:{" "}
                            <span className="text-gray-700 font-medium">
                                {currentGroups}
                            </span>
                        </p>
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Guruhni tanlang
                        </label>

                        {groups.length > 0 ? (
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            >
                                <option value="" disabled>
                                    Guruhni tanlang
                                </option>

                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-gray-500 text-sm">Mavjud guruh yo'q</p>
                        )}
                    </div>
                </DialogBody>

                <DialogFooter className="pt-3 border-t">
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={handleOpen}
                        disabled={loading}
                        className="hover:bg-gray-100 normal-case mr-[10px]"
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        onClick={AddToGroup}
                        disabled={!selectedGroup || loading}
                        className={`${!selectedGroup ? "bg-gray-300" : "bg-gray-800 hover:bg-black"
                            } text-white normal-case shadow-sm`}
                    >
                        {loading ? "Qo'shilyapti..." : "Qo'shish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
