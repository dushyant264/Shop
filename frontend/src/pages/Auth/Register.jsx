import { useState, useEffect } from "react"
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import Loader from "../../Components/Loader"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import { useRegisterMutation } from "../../redux/api/usersApiSlice"


const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

const [register, {isLoading}] = useRegisterMutation()
const {userInfo} = useSelector(state=>state.auth)

const {search} = useLocation()
const sp = new URLSearchParams(search)
const redirect = sp.get('redirect') || '/'

useEffect(() => {
    if (userInfo) {
        navigate(redirect)
    }
}, [navigate, redirect, userInfo])

const submitHandler = async (e) => {

    e.preventDefault()

    // add a try and catch for the case when any of the field is empty
    if(!username || !email || !password || !confirmPassword){
        toast.error('Please fill all the fields')
    }

    if(password !== confirmPassword){
        toast.error('Passwords do not match')
    } else {
        try {
            const res= await register({username,email,password}).unwrap()
            dispatch(setCredentials({...res}))
           
            toast.success('User Successfully Registered')
            
        } catch (error) {
            console.log(error);
            toast.error(error.data.message)
        }
    }
}
  return (
    <section  className="pl-[10rem] flex  overflow-hidden">
        <div className="mr-[4rem] mt-[5rem]"> 
           <h1 className="text-2xl font-semibold mb-4">Register</h1>

           <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
                <label htmlFor="name" className="gray-200 text-sm font-medium text-black">Name</label>
                <input type="text" id="name" className="mt-1 p-2 border border-black rounded w-full" onChange={(e)=>setUsername(e.target.value)} value={username} placeholder="Enter Name"/>
            </div>
            <div className="my-[2rem]">
                <label htmlFor="email" className="gray-200 text-sm font-medium text-black">Email</label>
                <input type="email" id="email" className="mt-1 p-2 border border-black rounded w-full" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="Enter Email"/>
            </div>
            <div className="my-[2rem]">
                <label htmlFor="password" className="gray-200 text-sm font-medium text-black">Password</label>
                <input type="password" id="password" className="mt-1 p-2 border border-black rounded w-full" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Enter Password"/>
            </div>
            <div className="my-[2rem]">
                <label htmlFor="confirmPassword" className="gray-200 text-sm font-medium text-black">Confirm Password</label>
                <input type="password" id="confirmPassword" className="mt-1 p-2 border border-black rounded w-full" onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm Password"/>
            </div>

            <button className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]">{isLoading? 'Registering...':'Register'}</button>
           </form>

           <div className="mt-4">
            <p className="text-black">
                Already have an account? {''}
                <Link to={redirect? `/login?redirect=${redirect}`:'/login'} className="text-pink-500 hover:underline-offset-1">Login</Link>
            </p>
           </div>
        </div>

        <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt=""
        className="h-[90vh] w-[59%] xl:block md:hidden sm:hidden rounded-lg mt-[2rem]"
      />
    </section>
  )
}

export default Register