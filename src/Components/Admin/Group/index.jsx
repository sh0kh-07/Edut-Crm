import { useEffect, useState } from "react";
import { GroupApi } from "../../../utils/Controllers/GroupApi";
import Create from "./_component/Create";
import Cookies from "js-cookie";

import {
    Card,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";

import {
    Users,
    Calendar,
    Clock,
    MapPin,
    Wallet,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import Loading from "../../Other/UI/Loadings/Loading";
import Delete from "./_component/Delete";
import Put from "./_component/Put";
import { NavLink } from "react-router-dom";
import Eye from "../../Other/UI/Icons/Eye";
import Add from "./_component/Add";

export default function Group() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
        total_count: 0
    });

    const GetGroup = async (page = 1) => {
        try {
            setLoading(true);
            const data = {
                school_id: Number(Cookies?.get("school_id")),
                page: page
            };

            const response = await GroupApi?.Get(data);

            setGroups(response?.data?.data?.records || []);
            setPagination(response?.data?.data?.pagination || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetGroup();
    }, []);

    const formatPrice = (num) =>
        num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[25px] font-bold">Guruhlar</h1>
                <Create refresh={GetGroup} />
            </div>
            {groups?.length > 0 ? (
                <>
                    <div className="flex flex-col gap-4">
                        {groups.map((g) => (
                            <Card className="w-full border border-gray-200 shadow-sm hover:shadow-lg transition rounded-xl">
                                <CardBody className="flex flex-col gap-4">

                                    {/* Title + Status */}
                                    <div className="flex items-center justify-between pb-2 border-b">
                                        <Typography className="text-[18px] font-bold">
                                            {g.name}
                                        </Typography>

                                        <div className="flex items-center gap-[10px]">
                                            <NavLink to={`/admin/group/${g?.id}`}>
                                                <Button
                                                    className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 normal-case p-[8px]"
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                            </NavLink>
                                            {g?.subject <= 0 && (<Add group={g} refresh={GetGroup} />)}
                                            <Put data={g} refresh={GetGroup} />
                                            <Delete id={g?.id} refresh={GetGroup} />
                                        </div>
                                    </div>

                                    {/* Табличный стиль */}
                                    <div className="grid grid-cols-2 gap-y-2 text-gray-700">

                                        <div className="flex gap-2">
                                            <Calendar size={18} />
                                            <span>Boshlanish: {g.start_date}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <MapPin size={18} />
                                            <span>Xona: {g.room_id}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Clock size={18} />
                                            <span>{g.start_time} — {g.end_time}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Wallet size={18} />
                                            <span>{formatPrice(g.price)} so‘m</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination?.total_pages > 1 && (
                        <div className="flex justify-end items-center gap-4 mt-5">
                            <Button
                                className="bg-black text-white p-3"
                                disabled={pagination.currentPage <= 1 || loading}
                                onClick={() => GetGroup(pagination.currentPage - 1)}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="font-medium">
                                {pagination.currentPage} / {pagination.total_pages}
                            </div>

                            <Button
                                className="bg-black text-white p-3"
                                disabled={pagination.currentPage >= pagination.total_pages || loading}
                                onClick={() => GetGroup(pagination.currentPage + 1)}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyData text={'Gruh mavjud emas'} />
            )}
        </>
    );
}
