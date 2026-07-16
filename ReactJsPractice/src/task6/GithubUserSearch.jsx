import {  useState } from "react"
import GitUserCard from "../components/GitUserCard";


const GithubUserSearch = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("")
    const searchUser = async (e) => {
        try {
            setLoading(true);
            e.preventDefault();
            console.log(username);

            const res = await fetch(`https://api.github.com/users/${username.trim()}`);
            const data = await res.json();
            console.log(data);
            setResult(data)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)

        }

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

    if (result !== "") {
        return( <GitUserCard {...result} />)
       
    }


    return (
        <div className=" min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={searchUser} className="flex flex-col justify-center items-center gap-2">
                <label htmlFor="userInput">Search a Github User by username</label>
                <input className="border px-3 py-2" id="userInput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button type="submit" className="bg-black px-3 py-2 text-white" >Search</button>
            </form>
        </div>

    )
}

export default GithubUserSearch
