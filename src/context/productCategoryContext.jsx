import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

// Création du contexte global pour les catégories de produits
export const ProductCategoryContext = createContext()

export const ProductCategoryProvider = ({ children }) => {
  // États pour stocker les catégories, l'état de chargement et les erreurs
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupération des catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/productCategory`)
      setCategories(res.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // Création d'une nouvelle catégorie avec image
  const createCategory = async (formData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/productCategory`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setCategories(prev => [...prev, res.data.newProductCategory])
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Mise à jour d'une catégorie existante
  const updateCategory = async (id, formData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/productCategory/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setCategories(prev => prev.map(cat => cat._id === id ? res.data.updated : cat))
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Suppression d'une catégorie par son ID
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/productCategory/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCategories(prev => prev.filter(cat => cat._id !== id))
    } catch (err) {
      throw err
    }
  }

  // Chargement initial des catégories au montage du composant
  useEffect(() => {
    fetchCategories()
  }, [])

  // Partage du contexte avec les composants enfants
  return (
    <ProductCategoryContext.Provider value={{ categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }}>
      {children}
    </ProductCategoryContext.Provider>
  )
}
