import PropTypes from "prop-types"


const GitUserCard = ({ avatar_url,name , bio, followers, following, public_repos, url, }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-80 rounded-3xl shadow-lg overflow-hidden bg-white">
                {/* img div  */}
                <div className="h-36 bg-rose-300 flex justify-center items-end ">
                    <img src={avatar_url} alt={name} className="w-28 h-28 rounded-full border-3 border-white object-cover" />
                    {/* <span className={`absolute bottom-1.5 w-4 h-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full right-28 border-2 border-white`}></span> */}
                </div>
                {/* card body  */}
                <div className="pt-6 text-center">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-gray-500">{bio}</p>
                    <p className="text-gray-500">{followers}</p>
                    <p className="text-gray-500">{following}</p>
                    <p className="text-gray-500">{public_repos}</p>
                    <p className="text-gray-500">{url}</p>
                    
                </div>
            </div>
        </div>
    )
}

GitUserCard.prototype = {
    name: PropTypes.string.isRequired,
    followers: PropTypes.number,
    following: PropTypes.number,
    bio: PropTypes.string,
    url: PropTypes.string,
    avatar_url: PropTypes.string,
    public_repos: PropTypes.number
}

export default GitUserCard