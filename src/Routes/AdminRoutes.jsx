import Cost from "../Components/Admin/Cost/Index";
import CostCategory from "../Components/Admin/CostCategory";
import Dashboard from "../Components/Admin/Dashboard";
import Group from "../Components/Admin/Group";
import GroupDetail from "../Components/Admin/GroupDetail";
import PaymentMethod from "../Components/Admin/PaymentMethod";
import Room from "../Components/Admin/Room";
import Salary from "../Components/Admin/Salary";
import SocialMedia from "../Components/Admin/SocialMedia";
import Student from "../Components/Admin/Student";
import Subject from "../Components/Admin/Subject";
import Teacher from "../Components/Admin/Teacher";

export const AdminRoutes = [
    {
        name: 'Admin dashboard',
        path: 'dashboard',
        component: <Dashboard />
    },
    {
        name: 'Teacher',
        path: 'teacher',
        component: <Teacher />
    },
    {
        name: 'Room',
        path: 'room',
        component: <Room />
    },
    {
        name: 'Student',
        path: 'student',
        component: <Student />
    },
    {
        name: 'Group',
        path: 'group',
        component: <Group />
    },
    {
        name: 'Subject',
        path: 'subject',
        component: <Subject />
    },
    {
        name: 'PaymentMethod',
        path: 'payment-method',
        component: <PaymentMethod />
    },
    {
        name: 'SocialMedia',
        path: 'social-media',
        component: <SocialMedia />
    },
    {
        name: 'CostCategory',
        path: 'cost-category',
        component: <CostCategory />
    },
    {
        name: 'Cost',
        path: 'cost',
        component: <Cost />
    },
    {
        name: 'Group detail',
        path: 'group/:id',
        component: <GroupDetail />
    },
        {
        name: 'Salary',
        path: 'salary',
        component: <Salary />
    },
]