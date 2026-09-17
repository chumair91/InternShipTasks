import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminNav from "./components/AdminNav";
import AdminSidebar from "./components/AdminSidebar";

const AdminNewLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <AdminNav collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
            </header>

            <div className="flex">
                <aside className={`${collapsed ? 'w-16' : 'w-56'} transition-all`}>
                    <AdminSidebar collapsed={collapsed} />
                </aside>

                <main className="flex-1 p-2">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminNewLayout;