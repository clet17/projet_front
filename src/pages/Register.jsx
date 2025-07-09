import { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Link } from 'react-router-dom'
import '../styles/pages/Register.scss'

function Register() {
  const { handleRegister } = useContext(AuthContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Vérifie que le mot de passe respecte les critères de sécurité
  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/
    return regex.test(password)
  }

  // Envoie le formulaire d’inscription après validation
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isPasswordValid(password)) {
      setErrorMessage("Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.")
      return
    }

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
      address
    }

    setErrorMessage('')
    handleRegister(e, data)
  }

  return (
    <div className='register'>
      <h2>Créer un compte</h2>

      {/* Formulaire d’inscription */}
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Prénom *' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type='text' placeholder='Nom *' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type='email' placeholder='Email *' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Mot de passe *' value={password} onChange={(e) => setPassword(e.target.value)} required />
        {errorMessage && <p className='error'>{errorMessage}</p>}
        <input type='text' placeholder='Téléphone *' value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type='text' placeholder='Adresse' value={address} onChange={(e) => setAddress(e.target.value)} />
        <button type='submit'>S'inscrire</button>
      </form>

      {/* Lien vers la page de connexion */}
      <div className='register__login-link'>
        <p>Déjà inscrit ? <Link to='/login'>Connectez-vous</Link></p>
      </div>
    </div>
  )
}

export default Register
