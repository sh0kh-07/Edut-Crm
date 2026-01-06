import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AttendanceApi } from "../../../../utils/Controllers/AttendanceApi";
import { Alert } from "../../../../utils/Alert";

export default function Attendance({ students, group }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("attendance"); // "attendance" | "history"
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [uniqueDates, setUniqueDates] = useState([]); // для заголовков дат

  const school_id = Number(Cookies.get("school_id"));
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const getAttendanceData = async () => {
    setLoading(true);
    try {
      const payload = {
        school_id,
        groupId: group?.id,
        page: 1,
        yers: mode === "history" ? selectedYear : new Date().getFullYear(),
        month: mode === "history" ? selectedMonth : new Date().getMonth() + 1,
      };

      const response = await AttendanceApi.Get(payload);
      const records = response?.data?.data?.records || [];

      if (mode === "history") {
        // История: все даты
        const historyData = students.map((student) => {
          const studentHistory = records.find((r) => r.student_id === student.student_id);
          return {
            student_id: student.student_id,
            student_name: student.student?.full_name,
            attendance: studentHistory?.attendance || [],
          };
        });

        // Собираем все уникальные даты из всех студентов
        const allDates = new Set();
        historyData.forEach((student) => {
          student.attendance.forEach((att) => {
            allDates.add(att.date);
          });
        });

        // Сортируем даты
        const sortedDates = Array.from(allDates).sort();
        setUniqueDates(sortedDates);
        setAttendance(historyData);
        setTotalPages(response?.data?.data?.totalPages || 1);
      } else {
        // Davomat: проверяем есть ли запись на сегодня
        const todayAttendance = students.map((student) => {
          const studentHistory = records.find((r) => r.student_id === student.student_id);
          const todayRecord = studentHistory?.attendance?.find((a) => a.date === today);

          if (todayRecord) {
            // Режим edit: берем существующий id
            return {
              id: todayRecord.id, // используем id вместо attendance_id
              school_id,
              student_id: student.student_id,
              group_id: group.id,
              status: todayRecord.status,
              student_name: student.student?.full_name,
              isEdit: true, // помечаем edit
            };
          }

          // Новая запись
          return {
            school_id,
            student_id: student.student_id,
            group_id: group.id,
            status: false,
            student_name: student.student?.full_name,
            isEdit: false,
          };
        });

        setAttendance(todayAttendance);
      }
    } catch (err) {
      console.log("Error →", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (group?.id) getAttendanceData();
  }, [group?.id, page, mode]);

  const toggleStatus = (student_id) => {
    setAttendance((prev) =>
      prev.map((a) => (a.student_id === student_id ? { ...a, status: !a.status } : a))
    );
  };

  const toggleHistoryStatus = (student_id, date) => {
    setAttendance((prev) =>
      prev.map((student) => {
        if (student.student_id === student_id) {
          return {
            ...student,
            attendance:
              student.attendance?.map((a) =>
                a.date === date ? { ...a, status: !a.status } : a
              ) || [],
          };
        }
        return student;
      })
    );
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      if (mode === "attendance") {
        // Разделяем на новые записи (POST) и обновления (PUT)
        const newRecords = attendance
          .filter((a) => !a.isEdit)
          .map((a) => ({
            school_id: a.school_id,
            student_id: a.student_id,
            group_id: a.group_id,
            status: a.status,
          }));

        const updateRecords = attendance
          .filter((a) => a.isEdit)
          .map((a) => ({
            attendance_id: a.id, // используем id вместо attendance_id
            school_id: a.school_id,
            student_id: a.student_id,
            group_id: a.group_id,
            status: a.status,
          }));

        // Отправляем POST для новых записей
        if (newRecords.length > 0) {
          await AttendanceApi.Create({ list: newRecords });
        }

        // Отправляем PUT для обновлений
        if (updateRecords.length > 0) {
          await AttendanceApi.Put(school_id, { list: updateRecords });
        }
      } else {
        // Для режима history - всегда PUT (обновление существующих)
        const payload = {
          list: attendance
            .map((a) =>
              a.attendance.map((att) => ({
                attendance_id: att.id, // используем id вместо attendance_id
                school_id,
                student_id: a.student_id,
                group_id: group.id,
                status: att.status,
              }))
            )
            .flat(),
        };
        await AttendanceApi.Put(school_id, payload);
      }

      Alert("Muvaffaqiyatli!", "success");
      getAttendanceData(); // обновляем после сохранения
    } catch (err) {
      console.log("Error →", err);
      Alert("Xato!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryFetch = () => {
    setPage(1);
    getAttendanceData();
  };

  // Функция для получения статуса студента по дате
  const getStatusByDate = (student, date) => {
    const record = student.attendance?.find((att) => att.date === date);
    return record || null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Davomat</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("attendance")}
            className={`px-4 py-2 rounded ${mode === "attendance" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Davomat
          </button>
          <button
            onClick={() => setMode("history")}
            className={`px-4 py-2 rounded ${mode === "history" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Tarix
          </button>
        </div>
      </div>

      {/* History filters */}
      {mode === "history" && (
        <div className="flex items-end gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yil</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oy</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleHistoryFetch} className="px-4 py-2 bg-green-600 text-white rounded">
            Ko'rsat
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">№</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">O'quvchi</th>
              {mode === "attendance" ? (
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Holati</th>
              ) : (
                // В режиме истории - каждая дата отдельная колонка
                uniqueDates.map((date) => (
                  <th key={date} className="text-center py-3 px-4 text-gray-600 font-medium">
                    {date}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((item, index) => (
                <tr key={item.student_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item?.student_name}</td>

                  {mode === "attendance" ? (
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(item.student_id)}
                        className={`px-4 py-1 rounded ${item.status ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                      >
                        {item.status ? "Bor" : "Yo'q"}
                      </button>
                    </td>
                  ) : (
                    // В режиме истории - для каждой даты своя ячейка
                    uniqueDates.map((date) => {
                      const record = getStatusByDate(item, date);
                      return (
                        <td key={date} className="py-3 px-4 text-center">
                          {record ? (
                            <button
                              onClick={() => toggleHistoryStatus(item.student_id, date)}
                              className={`px-3 py-1 rounded ${record.status ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                            >
                              {record.status ? "Bor" : "Yo'q"}
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={mode === "attendance" ? 3 : 2 + uniqueDates.length} className="py-8 text-center text-gray-500">
                  Ma'lumot yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Кнопка сохранения */}
      <div className="flex justify-end mt-6">
        <button onClick={saveAttendance} className="px-4 py-2 bg-green-600 text-white rounded">
          Saqlash
        </button>
      </div>

      {/* PAGINATION для истории */}
      {mode === "history" && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Oldingi
          </button>

          <div className="font-medium">
            {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      )}
    </div>
  );
}