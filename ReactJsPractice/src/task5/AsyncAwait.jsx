import { useState } from "react";


const AsyncAwait = () => {
    const [postCount, setPostCount] = useState(0);
    const [title, setTitle] = useState("");
    const [inputVal, setInputVal] = useState(0);
    const [userInputVal, setUserInputVal] = useState("");
    const [userDataRes, setUserDataRes] = useState("");



    async function getAllPosts() {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await res.json();
        setPostCount(data.length)
        // console.log(data.length);

        console.log(data);

    }

    async function getPostById() {
        let id = inputVal;
        if (id < 1 || id > 100) {
            setTitle("❌❌Id should be between 1 and 100")
            return
        }
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const data = await res.json();
        setTitle(data.title);
        console.log(data);

    }

    const getUserWithPostsWithPromiseAll = async () => {
        try {
            const userId = Number(userInputVal);
            if (userId < 1 || userId > 10) {
                setUserDataRes("❌❌User Id should be between 1 and 10")
                return
            }
            console.time("parrallel")

            const [userRes, postRes] = await Promise.all([fetch(`https://jsonplaceholder.typicode.com/users/${userId}`), fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)]);
            if (!userRes.ok || !postRes.ok) {
                throw new Error("Failed to fetch data");
            }
            const [userData, postData] = await Promise.all([userRes.json(), postRes.json()]);
            // console.log(userData, postData);
            console.timeEnd("parrallel")
            const data = {
                user: userData,
                posts: postData
            }
            setUserDataRes("data successfully Retrieved Check console")
            console.log(data);

        } catch (error) {
            console.log(error);

        }
    }

    const getUserWithPosts = async () => {
        try {
            let userId = Number(userInputVal);
            if (userId < 1 || userId > 10) {
                setUserDataRes("❌❌User Id should be between 1 and 10")
                return
            }
            console.time("sequential")
            const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            if (!userRes.ok) {
                throw new Error("Failed to fetch data");
            }
            const userData = await userRes.json();

            // if (Object.keys(userData).length === 0) {
            //     console.log("User not found");
            //     return;
            // }

            const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userData.id}`)
            if (!postRes.ok) {
                throw new Error("Failed to fetch data");
            }
            const postData = await postRes.json()

            console.timeEnd("sequential")
            // console.log("User:", userData);
            // console.log("Posts:", postData);
            const data = {
                user: userData,
                posts: postData
            }
            setUserDataRes("data successfully Retrieved Check console")
            console.log(data);



        } catch (error) {
            console.log(error);

        }
    }

    // const submitHandler=()=>{

    // }
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="flex justify-center items-center flex-col gap-2">
                <div className="flex flex-col gap-2 border p-3 items-center">
                    <h2 className="text-gray-700 font-medium text-[22px]">Get All Posts Count</h2>
                    <button className="bg-black px-8 py-3  rounded-2xl text-white text-base" onClick={getAllPosts}>GetAllPosts</button>
                    {Number(postCount) !== 0 && <p className="border px-3 py-2">
                        Number of Posts: {postCount}
                    </p>}
                </div>
                <div className="flex flex-col gap-2 border p-3 items-center">
                    <h2 className="text-gray-700 font-medium text-[22px]">Get Post By ID</h2>
                    <label >Write id between 1 and 100</label>
                    <input type="number" className="border px-3 py-2" placeholder="write btw 1 and 100" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                    <button className="bg-black px-8 py-3  rounded-2xl text-white text-base" onClick={getPostById}>GetPostById</button>
                    {title !== "" && <p className="border px-3 py-2 w-fit">
                        {title}
                    </p>}
                </div>
                <div className="flex flex-col gap-2 border p-3 items-center">
                    <h2 className="text-gray-700 font-medium text-[22px]">Get UserPosts By UserID </h2>
                    <label >Write id between 1 and 10</label>
                    <input type="number" className="border px-3 py-2" placeholder="write btw 1 and 10" value={userInputVal} onChange={(e) => setUserInputVal(e.target.value)} />
                    <button className="bg-black px-8 py-3  rounded-2xl text-white text-base" onClick={getUserWithPosts}>GetUserPostsById</button>
                    {userDataRes !== "" && <p className="border px-3 py-2 w-fit">
                        {userDataRes}
                    </p>}
                </div>
                <div className="flex flex-col gap-2 border p-3 items-center">
                    <h2 className="text-gray-700 font-medium text-[22px]">Get UserPosts By UserID little fast</h2>
                    <label >Write id between 1 and 10</label>
                    <input type="number" className="border px-3 py-2" placeholder="write btw 1 and 10" value={userInputVal} onChange={(e) => setUserInputVal(e.target.value)} />
                    <button className="bg-black px-8 py-3  rounded-2xl text-white text-base" onClick={getUserWithPostsWithPromiseAll}>GetUserPostsById</button>
                    {userDataRes !== "" && <p className="border px-3 py-2 w-fit">
                        {userDataRes}
                    </p>}
                </div>



            </div>
        </div>
    )
}

export default AsyncAwait