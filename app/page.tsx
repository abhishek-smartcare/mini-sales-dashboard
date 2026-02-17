import Link from "next/link";
import Login from "./login/page";

export default function Home () {

  return(
  <>
  <h1 className="text-center">Home Page</h1>
  <div>
  <Login/>  
  </div>
  </>)
} 