import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";

export default function Sidebar({ open }) {
    const [role] = useState("admin");
    const location = useLocation();

    const groupedMenuItems = [
        {
            section: "Asosiy",
            items: [
                {
                    id: 1,
                    title: "Dashboard",
                    path: "/admin/dashboard",
                    icon: (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 9.75L12 3l9 6.75M4.5 10.5v9.75h5.25V15h4.5v5.25H19.5V10.5"
                            />
                        </svg>
                    ),
                },
                {
                    id: 2,
                    title: "Ustozlar",
                    path: "/admin/teacher",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={23.84} height={22} viewBox="0 0 26 24"><path fill="currentColor" d="M22.313 17.295a7.44 7.44 0 0 0-4.089-2.754l-.051-.011l-1.179 1.99a1.003 1.003 0 0 1-1 1c-.55 0-1-.45-1.525-1.774v-.032a1.25 1.25 0 1 0-2.5 0v.033v-.002c-.56 1.325-1.014 1.774-1.563 1.774a1.003 1.003 0 0 1-1-1l-1.142-1.994a7.47 7.47 0 0 0-4.126 2.746l-.014.019a4.5 4.5 0 0 0-.655 2.197v.007c.005.15 0 .325 0 .5v2a2 2 0 0 0 2 2h15.5a2 2 0 0 0 2-2v-2c0-.174-.005-.35 0-.5a4.5 4.5 0 0 0-.666-2.221l.011.02zM7.968 5.29c0 2.92 1.82 7.21 5.25 7.21c3.37 0 5.25-4.29 5.25-7.21v-.065a5.25 5.25 0 1 0-10.5 0v.068zm11.234 1.72c0 1.902 1.186 4.698 3.42 4.698c2.195 0 3.42-2.795 3.42-4.698v-.052a3.421 3.421 0 0 0-6.842 0v.055v-.003zm-19.2 1.6c0 1.902 1.186 4.698 3.42 4.698c2.195 0 3.42-2.795 3.42-4.698v-.052a3.421 3.421 0 0 0-6.842 0v.055v-.003z"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Talabalar",
                    path: "/admin/student",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 512 512"><path fill="currentColor" d="M336 256c-20.56 0-40.44-9.18-56-25.84c-15.13-16.25-24.37-37.92-26-61c-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52c15.47 16.62 23 39.22 21.26 63.63c-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256m131.83 176H204.18a27.71 27.71 0 0 1-22-10.67a30.22 30.22 0 0 1-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05c31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 0 1-5.32 25.78A27.68 27.68 0 0 1 467.83 432M147 260c-35.19 0-66.13-32.72-69-72.93c-1.42-20.6 5-39.65 18-53.62c12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52c-2.87 40.2-33.8 72.91-68.93 72.91m65.66 31.45c-17.59-8.6-40.42-12.9-65.65-12.9c-29.46 0-58.07 7.68-80.57 21.62c-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 0 0 4.79 23.36A25.32 25.32 0 0 0 41.72 400h111a8 8 0 0 0 7.87-6.57c.11-.63.25-1.26.41-1.88c8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 0 0-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Guruhlar",
                    path: "/admin/group",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><path fill="currentColor" d="M1 18q-.425 0-.712-.288T0 17v-.575q0-1.075 1.1-1.75T4 14q.325 0 .625.013t.575.062q-.35.525-.525 1.1t-.175 1.2V18zm6 0q-.425 0-.712-.288T6 17v-.625q0-.8.438-1.463t1.237-1.162T9.588 13T12 12.75q1.325 0 2.438.25t1.912.75t1.225 1.163t.425 1.462V17q0 .425-.287.713T17 18zm12.5 0v-1.625q0-.65-.162-1.225t-.488-1.075q.275-.05.563-.062T20 14q1.8 0 2.9.663t1.1 1.762V17q0 .425-.288.713T23 18zM4 13q-.825 0-1.412-.587T2 11q0-.85.588-1.425T4 9q.85 0 1.425.575T6 11q0 .825-.575 1.413T4 13m16 0q-.825 0-1.412-.587T18 11q0-.85.588-1.425T20 9q.85 0 1.425.575T22 11q0 .825-.575 1.413T20 13m-8-1q-1.25 0-2.125-.875T9 9q0-1.275.875-2.137T12 6q1.275 0 2.138.863T15 9q0 1.25-.862 2.125T12 12"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Xonalar",
                    path: "/admin/room",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 16 16"><path fill="currentColor" d="M6.5 7A2.5 2.5 0 0 1 9 9.5v2A2.5 2.5 0 0 1 6.5 14h-2A2.5 2.5 0 0 1 2 11.5v-2A2.5 2.5 0 0 1 4.5 7zm5-5A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5H8.948A3.5 3.5 0 0 0 10 11.5v-2A3.5 3.5 0 0 0 6.5 6h-2c-.98 0-1.865.403-2.5 1.052V4.5A2.5 2.5 0 0 1 4.5 2z"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Fanlar",
                    path: "/admin/subject",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><path fill="currentColor" d="M5 19q-.425 0-.712-.288T4 18t.288-.712T5 17h8q.425 0 .713.288T14 18t-.288.713T13 19zm0-4q-.425 0-.712-.288T4 14t.288-.712T5 13h14q.425 0 .713.288T20 14t-.288.713T19 15zm0-4q-.425 0-.712-.288T4 10t.288-.712T5 9h14q.425 0 .713.288T20 10t-.288.713T19 11zm0-4q-.425 0-.712-.288T4 6t.288-.712T5 5h14q.425 0 .713.288T20 6t-.288.713T19 7z"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Tolov turi",
                    path: "/admin/payment-method",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 16 16"><g fill="currentColor"><path d="M13.502 11.008a.5.5 0 0 1 .349.14l2 2a.49.49 0 0 1 .11.54a.5.5 0 0 1-.11.16L13.85 15.85a.485.485 0 0 1-.54.111a.5.5 0 0 1-.16-.111a.486.486 0 0 1 0-.7L14.29 14H9.5a.503.503 0 0 1-.5-.5a.5.5 0 0 1 .5-.5h4.79l-1.14-1.15a.495.495 0 0 1 .352-.842"></path><path d="M6.923 1.378a3 3 0 0 1 2.154 0l4.961 1.908c.58.223.962.78.962 1.4v6.2l-.424-.424a1.5 1.5 0 0 0-.491-.34q-.043-.019-.085-.033V4.687a.5.5 0 0 0-.32-.467L8.718 2.312a2 2 0 0 0-1.436 0L2.32 4.22a.5.5 0 0 0-.32.467v6.627a.5.5 0 0 0 .32.466l4.962 1.908c.242.093.498.136.753.132a1.5 1.5 0 0 0 .627.924a3 3 0 0 1-1.74-.123l-4.96-1.908a1.5 1.5 0 0 1-.962-1.4V4.688a1.5 1.5 0 0 1 .962-1.4z"></path><path d="M4.04 5.303a.5.5 0 0 1 .657-.263L8 6.456l3.303-1.416a.5.5 0 0 1 .394.92L8.5 7.33v3.17a.5.5 0 0 1-1 0V7.33L4.303 5.96a.5.5 0 0 1-.263-.657"></path></g></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Ijtimoiy tarmoq",
                    path: "/admin/social-media",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 20 20"><path fill="currentColor" d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20m7.75-8a8 8 0 0 0 0-4h-3.82a29 29 0 0 1 0 4zm-.82 2h-3.22a14.4 14.4 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14m-8.85-2h3.84a24.6 24.6 0 0 0 0-4H8.08a24.6 24.6 0 0 0 0 4m.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4zm-6.08-2h3.82a29 29 0 0 1 0-4H2.25a8 8 0 0 0 0 4m.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6M3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6"></path></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Xarajat",
                    path: "/admin/cost",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}><path d="M31 34h12m-5 5l5-5l-5-5"></path><path d="M43 26V10a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h20.47"></path><path d="m15 15l5 6l5-6M14 27h12m-12-6h12m-6 0v12"></path></g></svg>
                    ),
                },
                {
                    id: 2,
                    title: "Xarajat turi",
                    path: "/admin/cost-category",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><path fill="currentColor" d="M7.425 9.475L11.15 3.4q.15-.25.375-.363T12 2.925t.475.113t.375.362l3.725 6.075q.15.25.15.525t-.125.5t-.35.363t-.525.137h-7.45q-.3 0-.525-.137T7.4 10.5t-.125-.5t.15-.525M17.5 22q-1.875 0-3.187-1.312T13 17.5t1.313-3.187T17.5 13t3.188 1.313T22 17.5t-1.312 3.188T17.5 22M3 20.5v-6q0-.425.288-.712T4 13.5h6q.425 0 .713.288T11 14.5v6q0 .425-.288.713T10 21.5H4q-.425 0-.712-.288T3 20.5"></path></svg>)
                },
                  {
                    id: 2,
                    title: "Oylik",
                    path: "/admin/salary",
                    icon: (
                       <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M5 9V6.8c0-.44.36-.8.8-.8h16.4c.44 0 .8.36.8.8v8.4c0 .44-.36.8-.8.8H20M2.8 9h16.4a.8.8 0 0 1 .8.8v8.4a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8V9.8a.8.8 0 0 1 .8-.8Zm9.2 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"/></svg>)
                },
            ],
        },
    ];

    return (
        <Card
            className={`h-[95%] fixed top-[15px] left-[15px] z-50 shadow-xl bg-white/30 backdrop-blur-md border border-white/20 px-4 py-6 overflow-y-auto transition-all duration-500
        ${open ? "w-[100px]" : "w-[220px]"}`}
        >
            <div className="flex items-center justify-center mb-6">
            </div>
            <div className="flex flex-col gap-6">
                {groupedMenuItems.map((group) => (
                    <div key={group.section}>
                        {!open && (
                            <Typography
                                variant="small"
                                color="gray"
                                className="mb-2 uppercase font-medium text-xs tracking-widest"
                            >
                                {group.section}
                            </Typography>
                        )}
                        <div className="flex flex-col gap-2">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center ${open && 'justify-center'} gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300
                      ${isActive
                                            ? "bg-white/80 text-[#4DA057] font-semibold shadow-md"
                                            : "text-gray-700 hover:bg-white/40 hover:text-[#0A9EB3]"
                                        }`
                                    }
                                >
                                    <span className="w-6 h-6">{item.icon}</span>
                                    {!open && <span className="text-sm">{item.title}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
