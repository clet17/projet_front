import { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Link } from 'react-router-dom'
import '../styles/pages/Login.scss'


function Login() {
  const { handleLogin } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(e, email, password)
  }

  return (
    <div className='login'>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='Email *' value={email} onChange={e => setEmail(e.target.value)} required />
        <input type='password' placeholder='Mot de passe *' value={password} onChange={e => setPassword(e.target.value)} required />
        <button type='submit'>Se connecter</button>
      </form>

      <div className='login__register-link'>
        <p>Pas de compte ? <Link to='/register'>Inscrivez-vous</Link></p>
      </div>
    </div>
  )
}

export default Login
