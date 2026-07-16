import PropTypes from "prop-types";

const GitUserCard = ({
  avatar_url,
  name,
  bio,
  followers,
  following,
  public_repos,
  html_url,
}) => {
  return (
    <div className="mt-8">
      <div className="w-96 rounded-2xl overflow-hidden bg-white shadow-xl border hover:shadow-2xl transition-all duration-300">

        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-end">
          <img
            src={avatar_url}
            alt={name}
            className="w-28 h-28 rounded-full border-4 border-white object-cover translate-y-14"
          />
        </div>

        {/* Body */}
        <div className="pt-16 pb-6 px-6 text-center">

          <h2 className="text-2xl font-bold">{name}</h2>

          <p className="text-gray-500 mt-2 min-h-[50px]">
            {bio || "No bio available"}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">

            <div>
              <h3 className="font-bold text-xl">{followers}</h3>
              <p className="text-sm text-gray-500">Followers</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">{following}</h3>
              <p className="text-sm text-gray-500">Following</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">{public_repos}</h3>
              <p className="text-sm text-gray-500">Repos</p>
            </div>

          </div>

          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            View GitHub Profile
          </a>

        </div>
      </div>
    </div>
  );
};

GitUserCard.propTypes = {
  name: PropTypes.string.isRequired,
  followers: PropTypes.number,
  following: PropTypes.number,
  bio: PropTypes.string,
  avatar_url: PropTypes.string,
  public_repos: PropTypes.number,
  html_url: PropTypes.string,
};

export default GitUserCard;