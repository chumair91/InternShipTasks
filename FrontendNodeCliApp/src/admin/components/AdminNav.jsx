
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { userContext } from "../../context/UserAuthContext";
import { GiHamburgerMenu } from "react-icons/gi";

const AdminNav = ({ onToggle }) => {
    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(userContext);

    return (
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <button onClick={onToggle} aria-label="Toggle sidebar" className="p-2 rounded hover:bg-gray-100">
                    <GiHamburgerMenu className="h-6 w-6" />
                </button>
                <div className="text-lg font-semibold">Admin Panel</div>
            </div>

            <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2">
                    <span className="hidden md:inline">{user?.name}</span>
                    <CgProfile size={28} />
                    {open ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-0.5 z-50 w-48 rounded-lg bg-white shadow-lg p-2">

                        <button
                            onClick={logout}
                            className="mt-0 flex w-full items-center justify-between rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            <span>{user ? 'logout' : 'login'}</span>
                            <IoIosArrowForward />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNav;