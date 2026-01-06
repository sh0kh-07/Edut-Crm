import { useEffect, useState } from "react";
import { GroupApi } from "../../../utils/Controllers/GroupApi";
import Create from "./_component/Create";
import Cookies from "js-cookie";

import {
    Card,
    CardBody,
    Typography,
    Button,
    Tooltip
} from "@material-tailwind/react";

import {
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

    if (loading) return <Loading />;

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                <h1 className="text-[25px] font-bold">Guruhlar</h1>
                <Create refresh={GetGroup} />
            </div>

            {groups?.length > 0 ? (
                <>
                    <div className="flex flex-col gap-4">
                        {groups.map((g) => (
                            <Card key={g.id} className="w-full border border-gray-200 shadow-sm hover:shadow-lg transition rounded-xl">
                                <CardBody className="flex flex-col gap-4">

                                    {/* Title + Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b gap-2 sm:gap-0">
                                        <Typography className="text-[18px] font-bold">{g.name}</Typography>

                                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                            <Tooltip content="O`chirish">
                                                <NavLink to={`/admin/group/${g?.id}`}>
                                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 normal-case p-2">
                                                        <Eye size={18} />
                                                    </Button>
                                                </NavLink>
                                            </Tooltip>
                                                {g?.subject <= 0 && (
                                                        <Add group={g} refresh={GetGroup} />
                                                )}
                                                <Put data={g} refresh={GetGroup} />
                                                <Delete id={g?.id} refresh={GetGroup} />
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 ">
                                        <div className="flex gap-2 items-center">
                                            <Calendar size={16} />
                                            <span className="text-sm sm:text-base">Boshlanish: {g.start_date}</span>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <MapPin size={16} />
                                            <span className="text-sm sm:text-base">Xona: {g.room?.name}</span>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <Clock size={16} />
                                            <span className="text-sm sm:text-base">{g.start_time} — {g.end_time}</span>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <Wallet size={16} />
                                            <span className="text-sm sm:text-base">{formatPrice(g.price)} so‘m</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination?.total_pages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4 mt-5">
                            <Button
                                className="bg-black text-white p-2 sm:p-3"
                                disabled={pagination.currentPage <= 1 || loading}
                                onClick={() => GetGroup(pagination.currentPage - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>

                            <div className="font-medium text-sm sm:text-base">
                                {pagination.currentPage} / {pagination.total_pages}
                            </div>

                            <Button
                                className="bg-black text-white p-2 sm:p-3"
                                disabled={pagination.currentPage >= pagination.total_pages || loading}
                                onClick={() => GetGroup(pagination.currentPage + 1)}
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
