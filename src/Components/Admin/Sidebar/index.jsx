import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import { School } from "../../../utils/Controllers/SchoolApi";


export default function Sidebar({ open }) {
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const sidebarRef = useRef(null);
    const [centerData, setCenter]=useState([])
    const type = Cookies?.get('type')

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 700);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Отслеживаем движение мыши и скрываем tooltip если мышь далеко
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (hoveredItem && sidebarRef.current) {
                const sidebarRect = sidebarRef.current.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // Проверяем, находится ли мышь в пределах sidebar + небольшой отступ
                const isNearSidebar =
                    mouseX >= sidebarRect.left - 10 &&
                    mouseX <= sidebarRect.right + 200 &&
                    mouseY >= sidebarRect.top - 10 &&
                    mouseY <= sidebarRect.bottom + 10;

                if (!isNearSidebar) {
                    setHoveredItem(null);
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [hoveredItem]);


    const getCenter = async () => {
        try {
            const response = await School?.GetById(Cookies?.get("school_id"))
            setCenter(response?.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCenter()
    }, [])

    const getActualOpenState = () => {
        if (isMobile && open) {
            return true;
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
        const itemRef = useRef(null);

        return (
            <div
                ref={itemRef}
                className="relative overflow-visible"
                onMouseEnter={() => open && setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
            >
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
                        setHoveredItem(null);
                    }}
                >
                    <span className="w-6 h-6">{item.icon}</span>
                    {!open && <span className="text-sm">{item.title}</span>}
                </NavLink>

                {/* Tooltip внутри элемента */}
                {open && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none">
                        <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap">
                            {item.title}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Компонент для меню с подпунктами
    const DropdownMenu = ({ item, open }) => {
        const itemRef = useRef(null);

        const isActive = item.subItems?.some(subItem =>
            window.location.pathname === subItem.path ||
            window.location.pathname.startsWith(subItem.path + "/")
        );

        return (
            <div
                ref={itemRef}
                className="relative overflow-visible"
                onMouseEnter={() => open && !openMenus[item.id] && setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <Menu
                    placement="right-start"
                    offset={15}
                    open={openMenus[item.id]}
                    handler={() => {
                        toggleMenu(item.id);
                        if (!openMenus[item.id]) {
                            setHoveredItem(null);
                        }
                    }}
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
                        className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl min-w-[180px] p-2 z-[9999] overflow-visible"
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

                {/* Tooltip внутри элемента */}
                {open && hoveredItem === item.id && !openMenus[item.id] && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none">
                        <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap">
                            {item.title}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900" />
                        </div>
                    </div>
                )}
            </div>
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
            ref={sidebarRef}
            className={`h-[95%] fixed top-[15px] left-[15px] z-50 shadow-xl bg-white/30 backdrop-blur-md border border-white/20 px-4 py-6 overflow-visible transition-all duration-500
        ${actualOpen ? "w-[70px]" : "w-[220px]"} `}
            onClick={closeAllMenus}
        >
            <div className="flex items-center justify-center mb-6">
                {!actualOpen && (
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        {centerData?.name}
                    </Typography>
                )}
                {actualOpen && (
                    <div className="w-8 h-8 rounded-full bg-[#4DA057] flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 overflow-visible">
                {allMenuItems.map((item) => renderMenuItem(item, actualOpen))}
            </div>
        </Card>
    );
}