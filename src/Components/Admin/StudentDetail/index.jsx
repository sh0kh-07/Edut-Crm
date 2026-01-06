import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StudentApi } from "../../../utils/Controllers/StudentApi";
import Cookies from "js-cookie";
import {
    Card,
    CardBody,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Avatar,
    Chip,
} from "@material-tailwind/react";
import { CreditCard, Users } from "lucide-react";
import Loading from "../../Other/UI/Loadings/Loading";

export default function StudentDetailUz() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [activeTab, setActiveTab] = useState("groups");
    const [loading, setLoading] = useState(true)

    const GetAllStudent = async () => {
        try {
            const data = {
                id: id,
                school_id: Number(Cookies?.get("school_id")),
            };
            const response = await StudentApi?.GetById(data);
            setStudent(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        GetAllStudent();
    }, []);

    // Функция для форматирования чисел в формат с пробелами
    const formatPrice = (num) => {
        if (!num) return 0;
        return new Intl.NumberFormat('ru-RU').format(num); // 70000 → 70 000
    };



    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="">
            {/* Asosiy karta */}
            <Card className="mb-6">
                <CardBody className="flex flex-col md:flex-row items-start md:items-start gap-4">

                    <div className="flex-1">
                        <Typography variant="h5" className="font-bold">
                            {student.full_name}
                        </Typography>
                        <Typography className="text-gray-600">
                            Telefon: {student.phone_number}
                        </Typography>
                        <Typography className="text-gray-600">
                            Ota-ona: {student.parents_full_name} ({student.parents_phone_number})
                        </Typography>
                        <Chip
                            value={student.status ? "Faol" : "Nofaol"}
                            color={student.status ? "green" : "red"}
                            className="mt-2 w-[70px] flex items-center justify-center"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Tabs: Guruhlar va To'lovlar */}
            <Tabs value={activeTab} className="w-full">
                <TabsHeader className="bg-gray-100 rounded-lg">
                    <Tab
                        value="groups"
                        onClick={() => setActiveTab("groups")}
                        icon={<Users size={18} />}
                    >
                        Guruhlar
                    </Tab>
                    <Tab
                        value="payments"
                        onClick={() => setActiveTab("payments")}
                        icon={<CreditCard size={18} />}
                    >
                        To'lovlar
                    </Tab>
                </TabsHeader>
                <TabsBody>
                    {/* Guruhlar */}
                    <TabPanel value="groups">
                        {student.group.length === 0 ? (
                            <Typography>Guruhlar mavjud emas</Typography>
                        ) : (
                            student.group.map((g) => (
                                <Card key={g.id} className="mb-4">
                                    <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <Typography className="font-bold">{g.group_name}</Typography>
                                            <Typography className="text-gray-600">
                                                Narx: {formatPrice(g.group.price)} UZS
                                            </Typography>

                                            <Typography className="text-gray-600">
                                                Boshlanish: {g.group.start_date} ({g.group.start_time} - {g.group.end_time})
                                            </Typography>
                                        </div>
                                        {/* <Chip
                                            value={g.group.status ? "Faol" : "Nofaol"}
                                            color={g.group.status ? "green" : "red"}
                                        /> */}
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </TabPanel>

                    {/* To'lovlar */}
                    {/* To'lovlar */}
                    <TabPanel value="payments">
                        {student.payment.length === 0 ? (
                            <Typography>To'lovlar mavjud emas</Typography>
                        ) : (
                            student.payment.map((p) => {
                                const paidDate = new Date(p.createdAt); // создаём объект даты
                                const formattedDate = paidDate.toLocaleDateString("uz-UZ", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <Card key={p.id} className="mb-4">
                                        <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <Typography className="font-bold">{p.method}</Typography>
                                                <Typography className="text-gray-600">
                                                    {p.month} {p.year}
                                                </Typography>
                                                <Typography className="text-gray-600">
                                                    Narx: {formatPrice(p.price)} UZS
                                                </Typography>
                                                {p.discount > 0 && (
                                                    <Typography className="text-gray-600">
                                                        Chegirma: {formatPrice(p.discount)}%
                                                    </Typography>
                                                )}
                                                <Typography className="text-gray-600">Tavsif: {p.description}</Typography>
                                                <Typography className="text-gray-600 font-semibold">
                                                    To‘langan vaqt: {formattedDate}
                                                </Typography>
                                            </div>
                                                
                                        </CardBody>
                                    </Card>
                                );
                            })
                        )}
                    </TabPanel>

                </TabsBody>
            </Tabs>
        </div>
    );
}
