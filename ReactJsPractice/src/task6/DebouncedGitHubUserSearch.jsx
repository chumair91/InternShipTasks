import { useEffect, useState } from 'react'
import GitUserCard from '../components/GitUserCard';
import useDebounce from '../../../Blog/src/hooks/useDebounce';

const DebouncedGitHubUserSearch = () => {


    const [username, setUsername] = useState("");
    const debusername = useDebounce(username, 500);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("")

    const searchUser = async (username) => {
        try {
            setLoading(true);

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

    // useEffect(() => {
    //     const id = setTimeout(() => {
    //         setDebusername(username);
    //     }, 500)
    //     return () => {
    //         clearTimeout(id);
    //     }
    // }, [username])

    useEffect(() => {
        if (!debusername) {
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        searchUser(debusername);
    }, [debusername])


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
        return (<GitUserCard {...result} />)

    }
    return (
        <div className=" min-h-screen flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2">
                <label htmlFor="userInput">Search a Github User by username</label>
                <input className="border px-3 py-2" id="userInput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            </div>
        </div>
    )
}

export default DebouncedGitHubUserSearch
