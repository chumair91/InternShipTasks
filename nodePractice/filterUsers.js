import axios from "axios";
import fs from "fs/promises";

const fetchUser = async () => {
  try {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    // const res = await fetch(`https://jsonplaceholder.typicode.com/users`);

    // const user =await res.json();
    const user = res.data;
    //   console.log(user);

    let letter = process.argv[2]
    const cityUser = user.filter((u) =>
      u.address.city.toLowerCase().startsWith(letter.toLowerCase()),
    );
    if (cityUser.length === 0) {
      throw new Error(`No users found whose city starts with "${letter}"`);
    }
    const newArr = cityUser.map((c) => ({
      name: c.name,
      email: c.email,
      city: c.address.city,
    }));

    await fs.writeFile("users.json", JSON.stringify(newArr, null, 2));
  } catch (error) {
    console.error(error);
  }
};

fetchUser();
