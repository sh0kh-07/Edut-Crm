import { useEffect, useState } from "react";
import { User } from "../../../utils/Controllers/User";
import Create from "./_components/Create";
import {
    Button,
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import {
    UserRound,
    Phone,
    BadgeCheck,
    Calendar,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Loading from "../../Other/UI/Loadings/Loading";
import Delete from "./_components/Delete";
import Eye from "../../Other/UI/Icons/Eye";
export default function Owner() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true)
    const getAllOwner = async () => {
        setLoading(true)
        try {
            const response = await User?.GetUsers();
            setOwners(response?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        getAllOwner();
    }, []);
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <div className="flex items-center justify-between flex-wrap mb-5">
                <h2 className="text-[25px] font-bold">Markaz egalari</h2>
                <Create refresh={getAllOwner} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {owners.map((item) => (
                    <Card key={item.id} className="shadow-md border rounded-xl">
                        <CardBody className="flex flex-col gap-3">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserRound className="w-6 h-6 text-blue-600" />
                                    <Typography className="text-lg font-semibold">
                                        {item.full_name}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <NavLink to={`/superadmin/owner/${item?.id}`}>
                                        <Button className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 normal-case p-2">
                                            <Eye size={18} />
                                        </Button>
                                    </NavLink>
                                    <Delete id={item?.id} refresh={getAllOwner} />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Phone className="w-5 h-5" />
                                <Typography>{item.phone_number}</Typography>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <BadgeCheck className="w-5 h-5" />
                                <Typography>Rol: {item.role}</Typography>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5" />
                                <Typography>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                ))}
        </div >
        </>
    );
}
