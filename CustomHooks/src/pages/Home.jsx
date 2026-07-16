import { Link } from "react-router-dom"


const Home = () => {
  return (
    <div className="h-screen flex justify-center items-center gap-3">
      <li><Link to={'/fetchgituser'}>Fetch Git User</Link></li>
      <li><Link to={'/usememo'}>use memo</Link></li>
      <li><Link to={'/parent'}>Parent & Expensive Child</Link></li>
    </div>
  )
}

export default Home
