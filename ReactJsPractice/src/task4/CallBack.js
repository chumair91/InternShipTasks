function getUserCallback(id, callback) {
  setTimeout(() => {
    if (id < 0) {
      callback(new Error("Invalid USer Id"));
    } else {
      callback(null, { id, name: "User" + id });
    }
  }, 1000);
}

// getUserCallback(5, (err, user) => {
//   console.log(err);
//   console.log(user);
// });

const getUserPromise = (id) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (id < 0) {
        rej(new Error("Invalid User Id"));
      } else {
        res({ id, name: "User" + id });
      }
    }, 1000);
  });
};

getUserPromise(1)
  .then((result) => {
    console.log(result);
    return getUserPromise(2);
  })
  .then((result) => {
    console.log(result);
    return getUserPromise(3);
  })
  .then((result) => {
    console.log(result);
  })

  .catch((err) => {
    console.log(err);
  });
