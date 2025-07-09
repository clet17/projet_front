import { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Link } from 'react-router-dom'
import '../styles/pages/Login.scss'

function Login() {
  // Récupération de la fonction handleLogin depuis le contexte Auth
  const { handleLogin } = useContext(AuthContext)

  // États pour gérer les champs du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Soumission du formulaire de connexion
  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(e, email, password)
  }

  return (
    <div className='login'>
      <h2>Connexion</h2>

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email *'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Mot de passe *'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Se connecter</button>
      </form>

      {/* Lien vers l'inscription */}
      <div className='login__register-link'>
        <p>Pas de compte ? <Link to='/register'>Inscrivez-vous</Link></p>
      </div>
    </div>
  )
}

export default Login
