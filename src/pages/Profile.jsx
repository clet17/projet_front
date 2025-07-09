import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../styles/pages/Profile.scss'

function Profile() {
  const { tokenStorage, logout, loading, setLoading } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Récupère les informations du profil utilisateur (GET /user/me)
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`,
        },
      })
      setUser(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Déclenche la récupération du profil si le token est dispo
  useEffect(() => {
    if (tokenStorage) {
      fetchProfile()
    }
  }, [tokenStorage])

  // Mise à jour locale des champs modifiés dans le formulaire
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // Envoie les nouvelles infos utilisateur au serveur (PUT /user/me)
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        {
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenStorage}`,
          },
        }
      )
      if (res.status === 200) {
        alert(res.data.message)
        setUser(res.data.user)
        setEditMode(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Affiche un message pendant le chargement ou si les données ne sont pas encore prêtes
  if (loading || !user) return <p>Chargement...</p>

  return (
    <main className='profile'>
      <h1>Mon profil</h1>

      {/* Affichage en lecture seule si editMode est désactivé */}
      {!editMode ? (
        <>
          <ul>
            <li><strong>Prénom :</strong> {user.first_name}</li>
            <li><strong>Nom :</strong> {user.last_name}</li>
            <li><strong>Email :</strong> {user.email}</li>
            <li><strong>Téléphone :</strong> {user.phone}</li>
            <li><strong>Adresse :</strong> {user.address}</li>
          </ul>
          <button onClick={() => setEditMode(true)}>Modifier</button>
        </>
      ) : (
        // Formulaire d’édition du profil
        <form onSubmit={handleUpdate} className='profile__form'>
          <input
            type='text'
            name='first_name'
            value={user.first_name}
            onChange={handleChange}
            placeholder='Prénom'
          />
          <input
            type='text'
            name='last_name'
            value={user.last_name}
            onChange={handleChange}
            placeholder='Nom'
          />
          <input
            type='text'
            name='phone'
            value={user.phone}
            onChange={handleChange}
            placeholder='Téléphone'
          />
          <input
            type='text'
            name='address'
            value={user.address}
            onChange={handleChange}
            placeholder='Adresse'
          />
          <button type='submit'>Enregistrer</button>
          <button type='button' onClick={() => setEditMode(false)}>Annuler</button>
        </form>
      )}

      {/* Actions supplémentaires : voir les commandes + se déconnecter */}
      <div className='profile__actions'>
        <Link to='/commandes' className='btn btn--light'>Voir mes commandes</Link>
        <button onClick={logout} className='btn btn--danger'>Déconnexion</button>
      </div>
    </main>
  )
}

export default Profile
