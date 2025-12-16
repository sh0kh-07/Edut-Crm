import { useParams } from "react-router-dom";
import { GroupApi } from "../../../utils/Controllers/GroupApi";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Loading from "../../Other/UI/Loadings/Loading";
import Create from "../Payment/component/Create";
import Attendance from "./_components/Attendance";
import StudentOut from "./_components/StudentOut";
import TeacherOut from "./_components/TeacherOut";
import { Payment } from "../../../utils/Controllers/Payment";


export default function GroupDetail() {
    const type = Cookies?.get('type')
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDebt, setLoadingDebt] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(1);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [debtors, setDebtors] = useState([]); // Только должники
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const GetGroup = async () => {
        try {
            const data = {
                school_id: Number(Cookies?.get("school_id")),
                id: id,
            };
            const response = await GroupApi.GetById(data);
            setGroup(response?.data);

            // Extract students and employees from response
            const groupData = response?.data;
            setStudents(groupData?.students || groupData?.student || []);
            setEmployees(groupData?.employees || groupData?.employee || []);
        } catch (error) {
            console.log(error);
        }
    };

    const GetDebtor = async (page = 1) => {
        try {
            setLoadingDebt(true);
            const data = {
                school_id: Number(Cookies?.get("school_id")),
                group_id: id,
                years: currentYear,
                month: currentMonth,
                page: page
            };
            const response = await Payment?.GetDebtorInMonth(data);

            if (response?.data?.data?.records) {
                // Все кто пришел в ответе - должники
                const debtorsList = response?.data.data.records || [];
                if (page === 1) {
                    setDebtors(debtorsList);
                } else {
                    setDebtors(prev => [...prev, ...debtorsList]);
                }

                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.total_pages || 1);
                    setCurrentPage(response.data.pagination.currentPage || 1);
                }
            } else {
                setDebtors([]);
            }
        } catch (error) {
            console.log(error);
            setDebtors([]);
        } finally {
            setLoadingDebt(false);
        }
    };

    const loadAllDebtors = async () => {
        if (totalPages <= 1) return;

        for (let page = 2; page <= totalPages; page++) {
            await GetDebtor(page);
        }
    };

    const checkIfStudentIsDebtor = (studentId) => {
        if (!debtors || debtors.length === 0) {
            return {
                isDebtor: false,
                amount: 0,
                debtorInfo: null
            };
        }

        const debtor = debtors.find(d => d && d.student_id === studentId);

        if (!debtor) {
            return {
                isDebtor: false,
                amount: 0,
                debtorInfo: null
            };
        }

        // Если студент есть в списке debtors - он должник
        return {
            isDebtor: true,
            amount: debtor.debt || 0,
            debtorInfo: debtor
        };
    };

    const handleOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Belgilanmagan';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uz-UZ');
        } catch (error) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0 so\'m';
        return new Intl.NumberFormat('uz-UZ').format(Number(price)) + ' so\'m';
    };

    const getDebtSummary = () => {
        if (!debtors || !Array.isArray(debtors) || debtors.length === 0) {
            return {
                totalDebtAmount: 0,
                debtorsCount: 0
            };
        }

        let totalDebtAmount = 0;

        debtors.forEach(debtor => {
            if (debtor && debtor.debt) {
                totalDebtAmount += Number(debtor.debt);
            }
        });

        return {
            totalDebtAmount,
            debtorsCount: debtors.length
        };
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await GetGroup();
            await GetDebtor(1);
            setLoading(false);
        };
        loadData();
    }, [id]);

    useEffect(() => {
        if (debtors && debtors.length > 0 && totalPages > 1) {
            loadAllDebtors();
        }
    }, [debtors, totalPages]);

    if (loading) {
        return <Loading />;
    }

    if (!group) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-red-600">Guruh topilmadi</div>
            </div>
        );
    }

    const { totalDebtAmount, debtorsCount } = getDebtSummary();

    return (
        <div className="container mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                    <div className="text-gray-600 text-sm mt-1">
                        {currentYear}-yil {currentMonth}-oy qarzdorlar
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${group.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {group.status ? 'Faol' : 'Faol emas'}
                </div>
            </div>

            <div className="flex items-start gap-6 w-full">
                {/* Left Column - Group Info, Employees, Students */}
                <div className="w-[30%] space-y-6">
                    {/* Group Basic Info */}
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
                                <div className="font-medium">{group.room_id || 'Belgilanmagan'}</div>
                            </div>

                        </div>
                    </div>

                    {/* Employees Accordion */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                            onClick={() => handleOpen(1)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">{type === "PreSchool" ? 'Tarbiyachi' : 'Ustoz'}</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {employees?.length || 0}
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
                                {employees && employees.length > 0 ? (
                                    <div className="space-y-3">
                                        {employees.map((emp, index) => (
                                            <div key={emp?.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div >
                                                    <div className="font-medium">{emp?.employee?.full_name || 'Noma\'lum'}</div>
                                                    <div className="text-sm text-gray-500">{emp?.employee?.phone_number || ''}</div>
                                                </div>
                                                <TeacherOut id={emp?.id} refresh={GetGroup} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        {type === "PreSchool" ? 'Tarbiyachi belgilanmagan' : 'Ustoz belgilanmagan'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Students Accordion with Debt Status */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                            onClick={() => handleOpen(2)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">
                                    {type === "PreSchool" ? 'Bolalar' : 'Talabalar'}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    {students?.length || 0}
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
                                {loadingDebt ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : students && students.length > 0 ? (
                                    students.map((student, index) => {
                                        const debtInfo = checkIfStudentIsDebtor(student?.student_id);

                                        return (
                                            <div key={student?.id || index} className="p-3 border rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-medium">{student?.student?.full_name || 'Noma\'lum'}</div>
                                                        <div className="text-sm text-gray-600">{student?.student?.phone_number || ''}</div>
                                                    </div>
                                                    <div className="flex items-center gap-[10px]">
                                                        <Create
                                                            student_id={student?.student_id}
                                                            group_id={group?.id}
                                                            refresh={GetGroup}
                                                        />
                                                        <StudentOut
                                                            refresh={GetGroup}
                                                            id={student?.id}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Debt Status Display */}
                                                {debtInfo.isDebtor ? (
                                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <span className="text-red-600 font-medium">Qarzdor:</span>
                                                                <span className="ml-2 text-red-700">{formatPrice(debtInfo.amount)}</span>
                                                            </div>
                                                            <div className="text-xs text-red-500">
                                                                {currentYear}-yil {currentMonth}-oy
                                                            </div>
                                                        </div>
                                                        {debtInfo.debtorInfo?.group_price && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Guruh narxi: {formatPrice(debtInfo.debtorInfo.group_price)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <span className="text-green-600 font-medium">Qarzi yo'q</span>
                                                            </div>
                                                            <div className="text-xs text-green-500">
                                                                {currentYear}-yil {currentMonth}-oy
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        {type === "PreSchool" ? 'Bolalar belgilanmagan' : 'Talabalar belgilanmagan'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Debt Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Qarzdorlar hisoboti</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Jami o'quvchilar:</span>
                                <span className="font-medium">{students?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Qarzdorlar soni:</span>
                                <span className="font-medium text-red-600">
                                    {debtorsCount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Umumiy qarz summasi:</span>
                                <span className="font-medium text-red-600">
                                    {formatPrice(totalDebtAmount)}
                                </span>
                            </div>
                            {debtorsCount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">O'rtacha qarz:</span>
                                    <span className="font-medium text-red-600">
                                        {formatPrice(totalDebtAmount / debtorsCount)}
                                    </span>
                                </div>
                            )}
                            <div className="text-xs text-gray-500 text-center mt-4 pt-3 border-t">
                                Ma'lumotlar: {currentYear}-yil {currentMonth}-oy |
                                Sahifa: {currentPage}/{totalPages}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Attendance Table */}
                <div className="w-[70%]">
                    <Attendance
                        students={students || []}
                        group={group}
                    />
                </div>
            </div>
        </div>
    );
}