import { useParams } from "react-router-dom";
import { GroupApi } from "../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Loading from "../../Other/UI/Loadings/Loading";
import Create from "../Payment/component/Create";

export default function GroupDetail() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(1);
    const [attendanceData, setAttendanceData] = useState([]);

    const GetGroup = async () => {
        try {
            const data = {
                school_id: Number(Cookies?.get("school_id")),
                id: id,
            };
            const response = await GroupApi.GetById(data);
            setGroup(response?.data);
            generateAttendanceData(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const generateAttendanceData = (groupData) => {
        if (!groupData || !groupData.student) return;

        const mockAttendance = [
            { id: 1, date: "2025-12-07", status: "present" },
            { id: 2, date: "2025-12-14", status: "absent" },
            { id: 3, date: "2025-12-21", status: "late" },
            { id: 4, date: "2025-12-28", status: "present" },
            { id: 5, date: "2026-01-04", status: "present" },
            { id: 6, date: "2026-01-11", status: "absent" },
            { id: 7, date: "2026-01-18", status: "present" },
            { id: 8, date: "2026-01-25", status: "late" },
        ];

        const data = [];
        groupData.student.forEach((student, studentIndex) => {
            mockAttendance.forEach((attendance, attendanceIndex) => {
                data.push({
                    id: studentIndex * 10 + attendanceIndex,
                    studentId: student.id || studentIndex + 1,
                    studentName: student.name || `O'quvchi ${studentIndex + 1}`,
                    date: attendance.date,
                    status: attendance.status,
                    notes: attendance.status === 'absent' ? 'Sababsiz' :
                        attendance.status === 'late' ? '15 daqiqa kech qoldi' : ''
                });
            });
        });

        setAttendanceData(data);
    };

    const handleOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ');
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(Number(price)) + ' so\'m';
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present': return 'Bor';
            case 'absent': return 'Yo\'q';
            case 'late': return 'Kech qoldi';
            default: return 'Noma\'lum';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        GetGroup();
    }, [id]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!group) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-red-600">Guruh topilmadi</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm ${group.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {group.status ? 'Faol' : 'Faol emas'}
                </div>
            </div>

            <div className="flex items-start gap-6 w-full">
                <div className="w-[30%] space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Asosiy ma'lumotlar</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-gray-600 mb-1">Boshlanish sanasi</div>
                                <div className="font-medium">{formatDate(group.start_date)}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Dars vaqtlari</div>
                                <div className="font-medium">{formatTime(group.start_time)} - {formatTime(group.end_time)}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Narxi</div>
                                <div className="font-medium">{formatPrice(group.price)}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Xona raqami</div>
                                <div className="font-medium">{group.room_id}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Maktab nomi</div>
                                <div className="font-medium">{group.school?.name}</div>
                                <div className="text-sm text-gray-500">{group.school?.address}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                            onClick={() => handleOpen(1)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">Hodimlar</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {group.employee?.length || 0}
                                </span>
                            </div>
                            <svg
                                className={`w-5 h-5 transform transition-transform ${openAccordion === 1 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {openAccordion === 1 && (
                            <div className="px-6 pb-4">
                                {group.employee && group.employee.length > 0 ? (
                                    <div className="space-y-3">
                                        {group.employee.map((emp, index) => (
                                            <div key={index} className="p-3 border rounded-lg">
                                                <div className="font-medium">{emp.name || `Hodim ${index + 1}`}</div>
                                                <div className="text-sm text-gray-600">{emp.position || 'Lavozim belgilanmagan'}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        Hodimlar belgilanmagan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
        onClick={() => handleOpen(2)}
    >
        <div className="flex items-center gap-2">
            <span className="text-lg font-medium">O'quvchilar</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {group.student?.length || 0}
            </span>
        </div>
        <svg
            className={`w-5 h-5 transform transition-transform ${openAccordion === 2 ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {openAccordion === 2 && (
        <div className="px-6 pb-4 space-y-3">
            {group.student && group.student.length > 0 ? (
                group.student.map((student, index) => (
                    <div key={index} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                            <div className="font-medium">{student.name || `O'quvchi ${index + 1}`}</div>
                            <div className="text-sm text-gray-600">{student.email || 'Kontakt ma\'lumotlari yo\'q'}</div>
                        </div>

                        <div>
                            <Create
                                student_id={student.id}
                                group_id={group.id}
                                refresh={() => GetPayments(group.id, student.id)}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-500 text-center py-4">
                    O'quvchilar ro'yxatdan o'tmagan
                </div>
            )}
        </div>
    )}
</div>


                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Yaratilgan:</span>
                                <span>{formatDate(group.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Yangilangan:</span>
                                <span>{formatDate(group.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[70%]">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Qabul qilish jadvali</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                    Eksport qilish
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                                    Filtrlash
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Sana</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">O'quvchi</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Holati</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Izoh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((attendance) => (
                                            <tr key={attendance.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">{formatDate(attendance.date)}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{attendance.studentName}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(attendance.status)}`}>
                                                        {getStatusText(attendance.status)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm text-gray-600">{attendance.notes}</div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8">
                                                <div className="text-gray-500 text-center">
                                                    Qabul qilish ma'lumotlari yo'q
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {attendanceData.length > 0 && (
                            <div className="flex justify-between items-center mt-6 pt-6 border-t">
                                <div className="text-sm text-gray-600">
                                    Jami: {attendanceData.length} ta yozuv
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                                        Oldingi
                                    </button>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        1
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                                        Keyingi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}