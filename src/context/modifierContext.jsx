// src/context/modifierContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './authContext'

export const ModifierContext = createContext(null)

export const ModifierProvider = ({ children }) => {
  const { tokenStorage } = useContext(AuthContext)

  const [modifiers, setModifiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchModifiers()
  }, [])

  return (
    <ModifierContext.Provider value={{ modifiers, loading, error, fetchModifiers, createModifier, updateModifier, deleteModifier }}>
      {children}
    </ModifierContext.Provider>
  )
}
