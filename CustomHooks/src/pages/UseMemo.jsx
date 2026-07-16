import { useMemo, useState } from "react";

const arr = [];
for (let i = 0; i < 500; i++) {
    arr.push({ id: i + 1, name: `item ${i + 1}` });
}
const UseMemo = () => {
    const [search, setSearch] = useState("");
    const [counter, setCounter] = useState(0);

   

    const filteredItems = useMemo(() => {
         console.log("filtering");
        return arr.filter((i) => {
            for (let j = 0; j < 10000; j++) { /* empty */ };
            return i.name.toLowerCase().includes(search.toLowerCase());


        })
    }, [search])

    return (
        <div className="flex justify-center items-center gap-6 flex-col mt-12 p-2">
            <input className="p-2"
                type="text"
                placeholder="Search item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-black p-2 text-white border" onClick={() => setCounter(prev => prev + 1)}>Inc Counter</button>

            <p>Counter: {counter}</p>
            {filteredItems.map((p) => (
                <p>{p.id}</p>
            ))}
        </div >
    )
}

export default UseMemo