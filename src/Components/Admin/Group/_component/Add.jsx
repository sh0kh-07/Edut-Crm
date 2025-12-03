import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import { Plus } from "lucide-react";
import { GroupApi } from "../../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { Alert } from "../../../../utils/Alert";
import { SubjectApi } from "../../../../utils/Controllers/SubjectApi";

export default function Add({ group, refresh }) {
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const GetSubject = async () => {
        try {
            const response = await SubjectApi.Get(Number(Cookies?.get("school_id")));
            if (response && response.data) {
                const groupGroupIds = group?.group?.map(g => g.id) || [];
                const availableGroups = response.data.filter(group =>
                    !groupGroupIds.includes(group.id)
                );
                setGroups(availableGroups);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetSubject();
    }, [group]);

    const AddSubject = async () => {
        if (!selectedGroup) return;

        setLoading(true);
        try {
            const selectedGroupData = groups.find(g => g.id === Number(selectedGroup));

            const data = {
                group_id: group.id,
                subject_name: selectedGroupData?.name || ""
            };

            const response = await GroupApi?.AddSubject(data);
            if (response) {
                setOpen(false);
                setSelectedGroup("");
                Alert("Muvaffaqiyatli!", "success");
                refresh()
            }
        } catch (error) {
            console.log(error);
            Alert("Xato!", "error");

        } finally {
            setLoading(false);
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

                    <div className="mt-2">
                        <h2 className="font-bold text-[20px] mb-[10px]">
                            Fan biriktirish
                        </h2>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                        >
                            <option value="" disabled>
                                Fandi tanlang
                            </option>

                            {groups.length > 0 ? (
                                groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    Mavjud fan yo'q
                                </option>
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
