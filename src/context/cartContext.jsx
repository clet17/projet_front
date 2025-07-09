import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { ModifierContext } from './modifierContext'

// Création du contexte de panier
export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { modifiers } = useContext(ModifierContext)

  // Chargement du panier depuis le localStorage (ou tableau vide si erreur)
  const loadCart = () => {
    try {
      const local = localStorage.getItem('cart')
      return local ? JSON.parse(local) : []
    } catch (_) {
      return []
    }
  }

  // État global du panier
  const [cart, setCart] = useState(loadCart)

  // Calcule le prix d’un modificateur selon son id
  const getModifierPrice = (id) => modifiers.find(m => m._id === id)?.price || 0

  // Calcule le prix unitaire total d’un produit (base + modificateurs)
  const getUnitPrice = (product, modifierIds) => {
    const modPrice = modifierIds.reduce((sum, id) => sum + getModifierPrice(id), 0)
    return product.price + modPrice
  }

  // Ajoute un nouveau produit au panier
  const addItem = (product, quantity, modifierIds, comment) => {
    const unit_price = getUnitPrice(product, modifierIds)
    const newItem = {
      tempId: uuid(),
      product: product._id,
      productName: product.name,
      quantity,
      unit_price,
      comment: comment || '',
      modifiers: modifierIds
    }
    setCart(prev => [...prev, newItem])
  }

  // Met à jour un produit existant dans le panier
  const updateItem = (tempId, data) => {
    setCart(prev => prev.map(item => item.tempId === tempId ? { ...item, ...data } : item))
  }

  // Supprime un produit du panier
  const removeItem = (tempId) => {
    setCart(prev => prev.filter(item => item.tempId !== tempId))
  }

  // Vide complètement le panier
  const clearCart = () => setCart([])

  // Calcule le prix total du panier
  const cartTotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  // Sauvegarde du panier à chaque changement dans le localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Expose les fonctions et le panier aux autres composants
  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}
