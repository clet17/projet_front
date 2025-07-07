import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { ModifierContext } from './modifierContext'

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { modifiers } = useContext(ModifierContext)

  const loadCart = () => {
    try {
      const local = localStorage.getItem('cart')
      return local ? JSON.parse(local) : []
    } catch (_) {
      return []
    }
  }

  const [cart, setCart] = useState(loadCart)

  const getModifierPrice = (id) => modifiers.find(m => m._id === id)?.price || 0

  const getUnitPrice = (product, modifierIds) => {
    const modPrice = modifierIds.reduce((sum, id) => sum + getModifierPrice(id), 0)
    return product.price + modPrice
  }

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

  const updateItem = (tempId, data) => {
    setCart(prev => prev.map(item => item.tempId === tempId ? { ...item, ...data } : item))
  }

  const removeItem = (tempId) => {
    setCart(prev => prev.filter(item => item.tempId !== tempId))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}
