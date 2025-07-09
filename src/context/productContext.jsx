import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

// Contexte global pour la gestion des produits
export const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupération du token pour les requêtes sécurisées
  const token = localStorage.getItem('token')

  // Récupération de tous les produits depuis l'API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`)
      setProducts(res.data)
    } catch (err) {
      console.error('Erreur fetchProducts :', err)
      setError('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  // Création d’un nouveau produit (avec image + modificateurs)
  const createProduct = async (productData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/product`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts() // On recharge les produits pour refléter les changements
    } catch (err) {
      console.error('Erreur createProduct :', err)
      alert('Erreur lors de la création du produit')
    }
  }

  // Mise à jour d’un produit existant
  const updateProduct = async (id, updatedData) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/product/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts() // On recharge pour actualiser les infos liées (ex : catégorie)
    } catch (err) {
      console.error('Erreur updateProduct :', err)
      alert('Erreur lors de la mise à jour du produit')
    }
  }

  // Suppression d’un produit par son ID
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      await fetchProducts() // On recharge la liste après suppression
    } catch (err) {
      console.error('Erreur deleteProduct :', err)
      alert('Erreur lors de la suppression du produit')
    }
  }

  // Chargement initial des produits au montage
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fourniture du contexte à l’application
  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  )
}