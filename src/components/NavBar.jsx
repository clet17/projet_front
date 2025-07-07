import { useContext, useState } from 'react'
import '../styles/components/NavBar.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { CartContext } from '../context/cartContext'

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <header className='navbar'>
      <div className='navbar__container'>
        <div className='navbar__logo'>
          <Link to='/'>Beldi’z</Link>
        </div>

        <button className='navbar__toggle' onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'open' : ''}`}>
          <Link to='/'>Accueil</Link>
          <Link to='/menu'>Menu</Link>
          <Link to='/commander'>Commander</Link>

          {!isAuthenticated ? (
            <>
              <Link to='/login'>Connexion</Link>
              <Link to='/register'>S'inscrire</Link>
            </>
          ) : (
            <>
              <Link to='/panier'>Panier ({cart.length})</Link>
              <Link to='/profile'>Mon Profil</Link>
              <Link to='/commandes'>Mes commandes</Link>
              <span onClick={logout} style={{ cursor: 'pointer' }}>Déconnexion</span>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
