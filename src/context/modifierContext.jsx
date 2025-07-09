import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './authContext'

// Création du contexte global pour les modificateurs
export const ModifierContext = createContext(null)

export const ModifierProvider = ({ children }) => {
  const { tokenStorage } = useContext(AuthContext)

  // États pour stocker les modificateurs, l'état de chargement et les erreurs
  const [modifiers, setModifiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupère tous les modificateurs depuis l’API
  const fetchModifiers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/modifier`)
      setModifiers(res.data)
    } catch (err) {
      console.log(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // Création d’un nouveau modificateur (avec envoi de fichier image)
  const createModifier = async (formData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/modifier`, formData, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      fetchModifiers()
      return res
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // Mise à jour d’un modificateur existant
  const updateModifier = async (id, formData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/modifier/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      fetchModifiers()
      return res
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // Suppression d’un modificateur par son ID
  const deleteModifier = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/modifier/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`
        }
      })
      fetchModifiers()
      return res
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // Récupère les modificateurs au chargement du composant
  useEffect(() => {
    fetchModifiers()
  }, [])

  // Partage des données et fonctions via le contexte
  return (
    <ModifierContext.Provider value={{ modifiers, loading, error, fetchModifiers, createModifier, updateModifier, deleteModifier }}>
      {children}
    </ModifierContext.Provider>
  )
}
