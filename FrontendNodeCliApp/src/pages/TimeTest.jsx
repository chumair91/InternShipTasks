

function TimeTest() {
    
    const today = new Date();
    const hour = today.getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good Morning!";
    } else if (hour < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }

  return (
    <div>
      <h1>{greeting}</h1>
      <p>Today is: {today.toDateString()} </p>

    </div>
  )
}

export default TimeTest