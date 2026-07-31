import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../context/UserAuthContext';
import { CgProfile } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import api from '../api/axios';
const Navbar = ({ username }) => {
  const [open, setOpen] = useState(false);

  const { logout, user } = useContext(userContext);
  

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Random App Name</div>


      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span>{username}</span>
          <CgProfile size={30} />
          {open ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-0.5 z-50 w-48 rounded-lg bg-white shadow-lg p-2">
            <Link
              to="/plan"
              className="relative flex items-center justify-between rounded px-4 py-2 bg-purple-600 text-white hover:bg-purple-700"
            >
              <span className='absolute rounded-md p-0.5 bg-gray-100  text-black text-xs -top-2 left-0'>{user?.plan}</span>
              <span>Plan</span>
              <IoIosArrowForward />
            </Link>

            <button
              onClick={logout}
              className="mt-2 flex w-full items-center justify-between rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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

export default Navbar;