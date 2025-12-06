import { useParams } from "react-router-dom";
import { User } from "../../../utils/Controllers/User";
import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {
    UserRound,
    Phone,
    BadgeCheck,
    Calendar,
    School as SchoolIcon,
    MapPin,
    Image
} from "lucide-react";
import Loading from "../../Other/UI/Loadings/Loading";
import CreateSchool from "./_components/CreateSchool";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import CONFIG from "../../../utils/Config";

export default function OwnerDetail() {
    const { id } = useParams();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOwner = async () => {
        try {
            setLoading(true);
            const response = await User?.GetUser(id);
            setOwner(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOwner();
    }, [id]);

    if (loading) return <Loading />;

    if (!owner) {
        return (
            <div className="flex justify-center items-center h-60">
                <Typography>Owner topilmadi</Typography>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">

            {/* Header + Create Button */}
            <div className="flex justify-between items-center flex-wrap">
                <Typography variant="h4" className="font-bold text-black">
                    Markaz egasi haqida
                </Typography>
                <CreateSchool refresh={getOwner} ownerId={owner.id} />
            </div>

            {/* Owner Card — Black & White */}
            <Card className="shadow-lg border border-gray-300 rounded-xl bg-white">
                <div className="px-6 py-5 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                        <UserRound className="w-12 h-12 text-black" />
                        <div>
                            <Typography variant="h5" className="font-semibold text-black">
                                {owner.full_name}
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                                Rol: {owner.role}
                            </Typography>
                        </div>
                    </div>
                </div>

                <CardBody className="px-6 py-5 space-y-4">

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-black" />
                        <Typography className="text-gray-800">{owner.phone_number}</Typography>
                    </div>

                    {/* Login */}
                    <div className="flex items-center gap-3">
                        <BadgeCheck className="w-5 h-5 text-black" />
                        <Typography className="text-gray-800">Login: {owner.login}</Typography>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col gap-2 text-gray-700">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-black" />
                            <Typography className="text-sm">
                                Yaratilgan: {new Date(owner.createdAt).toLocaleString()}
                            </Typography>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-black" />
                            <Typography className="text-sm">
                                Yangilangan: {new Date(owner.updatedAt).toLocaleString()}
                            </Typography>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* SCHOOL LIST — black/white cards */}
            <div>
                <Typography
                    variant="h5"
                    className="font-semibold mb-3 flex items-center gap-2 text-black"
                >
                    <SchoolIcon className="w-6 h-6 text-black" />
                    Uning markazlari
                </Typography>

                {owner.school.length === 0 ? (
                    <EmptyData text={'Markazlar mavjud emas'} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {owner.school.map((s) => (
                            <Card
                                key={s.id}
                                className="border border-gray-200 rounded-2xl shadow-md bg-white p-5 transition hover:shadow-xl"
                            >
                                <div className="flex flex-col items-start gap-3">
                                    {/* Foto */}
                                    {s?.image ? (
                                        <img
                                            className="h-40  rounded-xl border"
                                            src={CONFIG?.API_URL + "/" + s?.image}
                                            alt="Maktab rasmi"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Image className="w-12 h-12 text-gray-500" />
                                        </div>
                                    )}

                                    {/* Nomi */}
                                    <Typography variant="h6" className="text-black">
                                        {s.name}
                                    </Typography>

                                    {/* Manzil */}
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-black" />
                                        <Typography className="text-sm">{s.address}</Typography>
                                    </div>

                                    {/* Sana */}
                                    <Typography className="text-xs text-gray-500 mt-2">
                                        Yaratilgan: {new Date(s.createdAt).toLocaleString()}
                                    </Typography>
                                </div>
                            </Card>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}
