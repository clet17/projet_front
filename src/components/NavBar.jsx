import { useContext, useState } from 'react'
import '../styles/components/NavBar.scss'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/authContext'
import { CartContext } from '../context/cartContext'

function NavBar() {
  // Récupération de l’état d’authentification et de la fonction logout
  const { isAuthenticated, logout } = useContext(AuthContext)

  // Récupération du contenu du panier (utilisé pour afficher le nombre d’articles)
  const { cart } = useContext(CartContext)

  // État local pour gérer l’ouverture du menu en mode mobile
  const [menuOpen, setMenuOpen] = useState(false)

  // Fonction pour ouvrir/fermer le menu
  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <header className='navbar'>
      <div className='navbar__container'>
        {/* Logo du site (cliquable vers la page d’accueil) */}
        <div className='navbar__logo'>
          <Link to='/'>Beldi’z</Link>
        </div>

        {/* Bouton burger pour ouvrir/fermer le menu en mobile */}
        <button className='navbar__toggle' onClick={toggleMenu}>
          ☰
        </button>

        {/* Navigation : s’ouvre ou se referme selon menuOpen */}
        <nav className={`navbar__nav ${menuOpen ? 'open' : ''}`}>
          <Link to='/'>Accueil</Link>
          <Link to='/menu'>Menu</Link>
          <Link to='/commander'>Commander</Link>

          {/* Si l’utilisateur est connecté */}
          {!isAuthenticated ? (
            <>
              <Link to='/login'>Connexion</Link>
              <Link to='/register'>S'inscrire</Link>
            </>
          ) : (
            <>
              {/* Panier avec le nombre d’articles */}
              <Link to='/panier'>Panier ({cart.length})</Link>
              <Link to='/profile'>Mon Profil</Link>
              <Link to='/commandes'>Mes commandes</Link>
              {/* Déconnexion via un span cliquable */}
              <span onClick={logout} style={{ cursor: 'pointer' }}>Déconnexion</span>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
