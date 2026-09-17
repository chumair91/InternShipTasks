import { MdSupportAgent } from "react-icons/md";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ collapsed }) => {
    return (
        <aside className={`h-screen bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
            <div className="p-3 flex flex-col h-full">
                <div className="mb-4">
                    {!collapsed ? (
                        <h2 className="text-center font-semibold text-lg">Admin Panel</h2>
                    ) : (
                        <div className="text-center text-sm">AP</div>
                    )}
                </div>

                <nav className="flex-1">
                    <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 rounded-lg p-3 mb-1 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                        <MdSupportAgent className="h-6 w-6" />
                        {!collapsed && <span>Home</span>}
                    </NavLink>

                    <NavLink to="/admin/support" className={({ isActive }) => `flex items-center gap-3 rounded-lg p-3 mb-1 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                        <MdSupportAgent className="h-6 w-6" />
                        {!collapsed && <span>Support</span>}
                    </NavLink>
                </nav>

                <div className="mt-auto text-sm text-gray-300 p-3">v1.0</div>
            </div>
        </aside>
    )
}

export default AdminSidebar