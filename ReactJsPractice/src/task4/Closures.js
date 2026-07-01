function createCounter() {
  let count = 0;

  function increment() {
    count++;
  }
  function decrement() {
    count--;
  }
  function getCount() {
    return count;
  }

  return {
    increment,
    decrement,
    getCount,
  };
}

const counter = createCounter();
// counter.increment()
// counter.increment()
// counter.increment()
// counter.decrement()
// let a=counter.getCount()
// console.log(a);
//output: 2

const user = {
  name: "umair",

  //   greet() {
  //     console.log(this.name);
  //   },

  greet: () => {
    console.log(this.name);
  },
};

// user.greet();

//in case of arrow greet function output is an error,Reason is because arrow function inherits this ,it does not have its own this

function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}

const hello=debounce(()=>console.log("hello"),1000);
hello()
hello()
