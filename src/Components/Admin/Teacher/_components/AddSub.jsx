import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import { Plus, X } from "lucide-react";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";

export default function AddSub({ employee, refresh }) {
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState(employee?.subject || []);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteLoad, setDeleteLoad] = useState(null);

    const handleOpen = () => setOpen(!open);

    // subject uchun selectda ko'rinmasligi kerak bo'lganlar
    const GetSubjects = async () => {
        try {
            const response = await GroupApi.GetAll(Number(Cookies?.get("school_id")));

            if (response && response.data) {
                const used = employee?.subject?.map(s => s.subject_name.trim()) || [];

                const available = response.data.filter(g =>
                    !used.includes(g.name.trim())
                );

                setGroups(available);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetSubjects();
        setSubjects(employee?.subject || []);
    }, [employee]);

    // ➕ Subject qo‘shish
    const AddSubject = async () => {
        if (!selectedGroup) return;

        setLoading(true);
        try {
            const selected = groups.find(g => g.id === Number(selectedGroup));

            const data = {
                employee_id: employee.id,
                subject_name: selected?.name || ""
            };

            const response = await GroupApi?.AddSubject(data);

            if (response) {
                Alert("Muvaffaqiyatli qo'shildi!", "success");

                setSelectedGroup("");
                refresh();
            }
        } catch (error) {
            Alert("Xatolik!", "error");
        } finally {
            setLoading(false);
        }
    };

    // ❌ Subject o‘chirish
    const DeleteSubject = async (id) => {
        setDeleteLoad(id);
        try {
            await GroupApi?.DeleteSubject(id);
            Alert("O'chirildi!", "success");
            refresh();
        } catch (error) {
            Alert("Xato!", "error");
        } finally {
            setDeleteLoad(null);
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 normal-case p-2 rounded-lg shadow-sm"
            >
                <Plus size={18} />
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm" className="rounded-lg">

                <DialogBody className="space-y-4 py-4">

                    <h2 className="text-[20px] mb-[5px] font-bold">
                        Fanlar
                    </h2>

                    {/* --- Subject List --- */}
                    <div className="space-y-2">
                        {subjects.length > 0 ? (
                            subjects.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-gray-50"
                                >
                                    <span className="text-gray-800 text-sm font-medium">
                                        {sub.subject_name}
                                    </span>

                                    <button
                                        onClick={() => DeleteSubject(sub.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        {deleteLoad === sub.id ? (
                                            <span className="text-xs">...</span>
                                        ) : (
                                            <X size={16} />
                                        )}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Fanlar yo‘q</p>
                        )}
                    </div>

                    {/* --- Subject Add Select --- */}
                    <div className="mt-3">
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800
                            focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                        >
                            <option value="" disabled>Fan tanlang</option>

                            {groups.length > 0 ? (
                                groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Mavjud fan yo‘q</option>
                            )}
                        </select>
                    </div>

                </DialogBody>

                <DialogFooter className="pt-3 border-t ">
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
                        onClick={AddSubject}
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
