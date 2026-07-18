import Child from "./Child"



const Practice = () => {

  function greet(){
    console.log("hello");
    
  }
  return (
    <div>
      <Child hareem="I am hareem" greet={greet} />
    </div>
  )
}

export default Practice
