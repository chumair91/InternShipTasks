import { useState } from "react"
import useFetch from "../hooks/useFetch";
import GitUserCard from "../components/GitUserCard";


const FetchGitUser = () => {
    const [username, setUserName] = useState("");
    
    const [url, setUrl] = useState("");
    const { data, loading, error } = useFetch(url);
    

    const handleSubmission = (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        const url = `https://api.github.com/users/${username.trim()}`;
        setUrl(url)

    }

    if (loading) {
        return (
            <>
                <div className="h-screen flex justify-center items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin">

                    </div>
                </div>
            </>
        )
    }
    if (error) {
        return (
            <h1 className="text-red-500">
                {error}
            </h1>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
            <form
                onSubmit={handleSubmission}
                className="flex flex-col items-center gap-4"
            >
                <label htmlFor="">Write github username</label>
                <input
                    type="text"
                    placeholder="Enter GitHub username..."
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-80 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Search
                </button>
                {data &&
                    (<GitUserCard {...data} />)

                }
            </form>

        </div>
    )
}

export default FetchGitUser
