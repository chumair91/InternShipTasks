import PropTypes from "prop-types"


const ProfileCard = ({ name, role, bio, avatarUrl, isOnline }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-80 rounded-3xl shadow-lg overflow-hidden bg-white">
                {/* img div  */}
                <div className="h-36 bg-rose-300 flex justify-center items-end relative">
                    <img src={avatarUrl} alt={name} className="w-28 h-28 rounded-full border-3 border-white object-cover" />
                    <span className={`absolute bottom-1.5 w-4 h-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full right-28 border-2 border-white`}></span>
                </div>
                {/* card body  */}
                <div className="pt-6 text-center">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-gray-500">{bio}</p>
                    <hr className="mt-10" />
                    <p className="text-sm mt-1 text-gray-700">{role}</p>
                </div>
            </div>
        </div>
    )
}

ProfileCard.prototype={
    name:PropTypes.string.isRequired,
    role:PropTypes.string.isRequired,
    bio:PropTypes.string,
    avatarUrl:PropTypes.string,
    isOnline:PropTypes.bool,
}

export default ProfileCard