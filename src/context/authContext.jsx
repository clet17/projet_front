import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Création du contexte d'authentification
export const AuthContext = createContext(null)

export const AuthController = ({ children }) => {
  const navigate = useNavigate()

  //pour verifier si l'user est authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(false) 
  // Infos du user connecté
  const [userInfo, setUserInfo] = useState(null)                  
  // Token stocké
  const [tokenStorage, setTokenStorage] = useState(null)          
  const [loading, setLoading] = useState(true)                  

  // Vérifie si un token est présent dans le localStorage au démarrage
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

  // Connexion d'un utilisateur
  const handleLogin = async (e, email, password) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password })
      if (res.status === 200) {
        // Sauvegarde du token + maj des infos user
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

  // Inscription d'un nouvel utilisateur
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

  // À appeler après inscription réussie
  const handleRegisterSuccess = (token) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token)
    setUserInfo(decoded)
    setTokenStorage(token)
    setIsAuthenticated(true)
    setLoading(false)
  }

  // Déconnexion on vide le localStorage et on redirige
  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserInfo(null)
    navigate('/login')
  }

  // Fournit les fonctions et données utiles à tous les composants
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      handleLogin,
      handleRegister,
      logout,
      userInfo,
      tokenStorage,
      loading,
      setLoading,
      handleRegisterSuccess
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
