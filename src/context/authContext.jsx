import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext(null)

export const AuthController = ({ children }) => {
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [tokenStorage, setTokenStorage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setUserInfo(decoded)
      setTokenStorage(token)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = async (e, email, password) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password })
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        const decoded = jwtDecode(res.data.token)
        setUserInfo(decoded)
        setTokenStorage(res.data.token)
        setIsAuthenticated(true)
        setLoading(false)
        alert(res.data.message)
        navigate('/')
      }
    } catch (err) {
      console.log(err.response)
      if (err) {
        alert(err.response.data)
      }
    }
  }

  const handleRegister = async (e, data) => {
  e.preventDefault()
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, data)
    if (res.status === 201) {
      alert(res.data.message)
      handleRegisterSuccess(res.data.token)
      navigate('/')
    }
  } catch (err) {
    console.log(err.response)
    if (err) {
      alert(err.response.data)
    }
  }
}

  const handleRegisterSuccess = (token) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token)
    setUserInfo(decoded)
    setTokenStorage(token)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserInfo(null)
    navigate('/login')
  }

  return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleLogin, handleRegister, logout, userInfo, tokenStorage, loading, setLoading, handleRegisterSuccess }}>{!loading && children}</AuthContext.Provider>
}
