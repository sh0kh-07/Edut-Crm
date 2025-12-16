import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Typography, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Users2,
    Building,
    BookOpen,
    CreditCard,
    Globe,
    DollarSign,
    ChevronRight,
    FolderTree,
    Settings,
    Receipt,
    Home,
    HandCoins
} from "lucide-react";
import Cookies from "js-cookie";


export default function Sidebar({ open }) {
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const type = Cookies?.get('type')

    // Проверяем ширину экрана при монтировании и при изменении размера
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 700);
        };

        // Проверяем сразу при загрузке
        checkMobile();

        // Добавляем слушатель изменения размера окна
        window.addEventListener('resize', checkMobile);

        // Очистка слушателя при размонтировании
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Функция для получения фактического состояния sidebar
    // Если ширина экрана меньше 700px И open активно, sidebar маленький
    const getActualOpenState = () => {
        if (isMobile && open) {
            return true; // маленький sidebar
        }
        return open;
    };

    const toggleMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const closeMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: false
        }));
    };

    const closeAllMenus = () => {
        setOpenMenus({});
    };

    // Все возможные пункты меню
    const allMenuItems = [
        {
            id: 1,
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard className="w-6 h-6" />,
            type: "link"
        },
        {
            id: 100,
            title: "Mijozlar",
            path: "/admin/client",
            icon: <Users className="w-6 h-6" />,
            type: "link"
        },
        {
            id: 2,
            title: type === "PreSchool" ? "Tarbiyachi" : "Ustozlar",
            path: "/admin/teacher",
            icon: <Users className="w-6 h-6" />,
            type: "link"
        },
        {
            id: 3,
            title: type === "PreSchool" ? "Bolalar" : "Talabalar",
            path: "/admin/student",
            icon: <GraduationCap className="w-6 h-6" />,
            type: "link"
        },
        {
            id: 4,
            title: "Guruhlar",
            path: "/admin/group",
            icon: <Users2 className="w-6 h-6" />,
            type: "link"
        },
        {
            id: 10,
            title: "Sozlamalar",
            icon: <Settings className="w-6 h-6" />,
            type: "menu",
            subItems: [
                {
                    id: 5,
                    title: "Xonalar",
                    path: "/admin/room",
                    icon: <Building className="w-5 h-5" />
                },
                {
                    id: 6,
                    title: type === "PreSchool" ? "Tilar" : "Fanlar",
                    path: "/admin/subject",
                    icon: <BookOpen className="w-5 h-5" />
                },
                {
                    id: 7,
                    title: "Tolov turi",
                    path: "/admin/payment-method",
                    icon: <CreditCard className="w-5 h-5" />
                },
                {
                    id: 8,
                    title: "Ijtimoiy tarmoq",
                    path: "/admin/social-media",
                    icon: <Globe className="w-5 h-5" />
                }
            ]
        },
        {
            id: 15,
            title: "Moliya",
            icon: <DollarSign className="w-6 h-6" />,
            type: "menu",
            subItems: [
                {
                    id: 20,
                    title: "Tolovlar",
                    path: "/admin/payment",
                    icon: <HandCoins className="w-5 h-5" />
                },
                {
                    id: 9,
                    title: "Oylik",
                    path: "/admin/salary",
                    icon: <DollarSign className="w-5 h-5" />
                },
                {
                    id: 10,
                    title: "Xarajatlar",
                    path: "/admin/cost",
                    icon: <Receipt className="w-5 h-5" />
                },
                {
                    id: 11,
                    title: "Xarajat turlari",
                    path: "/admin/cost-category",
                    icon: <FolderTree className="w-5 h-5" />
                },
                {
                    id: 12,
                    title: "Qarzdorlar",
                    path: "/admin/debtor",
                    icon: <Users className="w-5 h-5" />
                }
            ]
        }
    ];

    // Компонент для обычной ссылки
    const MenuLink = ({ item, open }) => {
        return (
            <NavLink
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center ${open ? 'justify-center' : ''} gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300
            ${isActive
                        ? "bg-white/80 text-[#4DA057] font-semibold shadow-md"
                        : "text-gray-700 hover:bg-white/40 hover:text-[#0A9EB3]"
                    }`
                }
                onClick={() => {
                    closeAllMenus();
                }}
            >
                <span className="w-6 h-6">{item.icon}</span>
                {!open && <span className="text-sm">{item.title}</span>}
            </NavLink>
        );
    };

    // Компонент для меню с подпунктами
    const DropdownMenu = ({ item, open }) => {
        const isActive = item.subItems?.some(subItem =>
            window.location.pathname === subItem.path ||
            window.location.pathname.startsWith(subItem.path + "/")
        );

        return (
            <Menu
                placement="right-start"
                offset={15}
                open={openMenus[item.id]}
                handler={() => toggleMenu(item.id)}
            >
                <MenuHandler>
                    <div
                        className={`flex items-center ${open ? 'justify-center' : ''} gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer
              ${isActive
                                ? "bg-white/80 text-[#4DA057] font-semibold shadow-md"
                                : "text-gray-700 hover:bg-white/40 hover:text-[#0A9EB3]"
                            }`}
                    >
                        <span className="w-6 h-6">{item.icon}</span>
                        {!open && (
                            <>
                                <span className="text-sm flex-1">{item.title}</span>
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform duration-200 ${openMenus[item.id] ? 'rotate-90' : ''}`}
                                />
                            </>
                        )}
                    </div>
                </MenuHandler>
                <MenuList
                    className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl min-w-[180px] p-2"
                    onClick={() => closeMenu(item.id)}
                >
                    {item.subItems.map((subItem) => (
                        <NavLink
                            key={subItem.id}
                            to={subItem.path}
                        >
                            {({ isActive }) => (
                                <MenuItem
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 my-0.5
                    ${isActive
                                            ? "bg-[#4DA057]/20 text-[#4DA057] font-semibold"
                                            : "text-gray-700 hover:bg-[#4DA057]/10 hover:text-[#4DA057]"
                                        }`}
                                    onClick={() => closeMenu(item.id)}
                                >
                                    {subItem.icon}
                                    <span>{subItem.title}</span>
                                </MenuItem>
                            )}
                        </NavLink>
                    ))}
                </MenuList>
            </Menu>
        );
    };

    // Рендеринг элемента меню
    const renderMenuItem = (item, open) => {
        if (item.type === "link") {
            return <MenuLink key={item.id} item={item} open={open} />;
        } else if (item.type === "menu") {
            return <DropdownMenu key={item.id} item={item} open={open} />;
        }
        return null;
    };

    const actualOpen = getActualOpenState();

    return (
        <Card
            className={`h-[95%]   fixed top-[15px] left-[15px] z-50 shadow-xl bg-white/30 backdrop-blur-md border border-white/20 px-4 py-6 overflow-y-auto transition-all duration-500
        ${actualOpen ? "w-[70px]" : "w-[220px]"} `}
            onClick={closeAllMenus}
        >
            <div className="flex items-center justify-center mb-6">
                {!actualOpen && (
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        Admin Panel
                    </Typography>
                )}
                {actualOpen && (
                    <div className="w-8 h-8 rounded-full bg-[#4DA057] flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {allMenuItems.map((item) => renderMenuItem(item, actualOpen))}
            </div>
        </Card>
    );
}