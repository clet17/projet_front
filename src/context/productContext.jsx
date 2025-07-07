// src/context/productContext.jsx
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

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

  const createProduct = async (productData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/product`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts() // On recharge tout avec les relations peuplées
    } catch (err) {
      console.error('Erreur createProduct :', err)
      alert('Erreur lors de la création du produit')
    }
  }

  const updateProduct = async (id, updatedData) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/product/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts() // Pareil, on recharge pour avoir les catégories complètes
    } catch (err) {
      console.error('Erreur updateProduct :', err)
      alert('Erreur lors de la mise à jour du produit')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      await fetchProducts() // Même logique pour garder les données cohérentes
    } catch (err) {
      console.error('Erreur deleteProduct :', err)
      alert('Erreur lors de la suppression du produit')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

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
