import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/productContext'
import { ProductCategoryContext } from '../../context/productCategoryContext'
import { ModifierContext } from '../../context/modifierContext'
import '../../styles/pages/AdminProduct.scss'
import AdminBackButton from '../../components/AdminBackButton'

function AdminProduct() {
  // Récupération des contextes pour les produits, catégories et modificateurs
  const { products, createProduct, updateProduct, deleteProduct, fetchProducts } = useContext(ProductContext)
  const { categories, fetchCategories } = useContext(ProductCategoryContext)
  const { modifiers, fetchModifiers } = useContext(ModifierContext)

  // Formulaire d'ajout de produit
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    allergens: '',
    price: '',
    image: null,
    category: ''
  })

  // État pour la modification d’un produit existant
  const [editProduct, setEditProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Chargement initial des données nécessaires
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchModifiers()
  }, [])

  // Gestion du changement dans le formulaire d'ajout
  const handleFormChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  // Soumission du formulaire d’ajout de produit
  const handleCreate = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })
    await createProduct(formData)
    setForm({ name: '', description: '', ingredients: '', allergens: '', price: '', image: null, category: '' })
  }

  // Ouvre la modale de modification avec les données préremplies
  const openModal = (product) => {
    setEditProduct({
      ...product,
      modifiers: product.modifiers?.map(m => typeof m === 'object' ? m._id : m) || [],
      category: product.category?._id || '',
      image: null
    })
    setIsModalOpen(true)
  }

  // Gère les changements dans le formulaire de modification
  const handleEditChange = (e) => {
    const { name, value, files, type, checked } = e.target

    if (name === 'modifiers') {
      setEditProduct(prev => ({
        ...prev,
        modifiers: checked ? [...prev.modifiers, value] : prev.modifiers.filter(id => id !== value)
      }))
    } else if (name === 'available') {
      setEditProduct(prev => ({ ...prev, available: checked }))
    } else {
      setEditProduct(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }))
    }
  }

  // Soumission du formulaire de modification
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    const fields = ['name', 'description', 'ingredients', 'allergens', 'price', 'category', 'available']
    fields.forEach(field => formData.append(field, editProduct[field]))
    formData.append('modifiers', editProduct.modifiers.join(','))
    if (editProduct.image instanceof File) {
      formData.append('image', editProduct.image)
    }
    await updateProduct(editProduct._id, formData)
    setIsModalOpen(false)
  }

  // Suppression d’un produit
  const handleDelete = async () => {
    if (window.confirm('Supprimer ce produit ?')) {
      await deleteProduct(editProduct._id)
      setIsModalOpen(false)
    }
  }

  // Regroupe les modificateurs par type
  const modifiersByType = {
    option: [],
    sauce: [],
    supplément: []
  }

  modifiers.forEach(mod => {
    if (mod.type in modifiersByType) {
      modifiersByType[mod.type].push(mod)
    }
  })

  return (
    <main className='admin-products'>
      <AdminBackButton />
      <h2>Produits</h2>

      {/* Formulaire pour ajouter un produit */}
      <form onSubmit={handleCreate} className='admin-products__form'>
        <input type='text' name='name' placeholder='Nom' value={form.name} onChange={handleFormChange} required />
        <textarea name='description' placeholder='Description' value={form.description} onChange={handleFormChange} />
        <input type='text' name='ingredients' placeholder='Ingrédients' value={form.ingredients} onChange={handleFormChange} />
        <input type='text' name='allergens' placeholder='Allergènes' value={form.allergens} onChange={handleFormChange} />
        <input type='number' name='price' placeholder='Prix' value={form.price} onChange={handleFormChange} required />
        <select name='category' value={form.category} onChange={handleFormChange} required>
          <option value=''>-- Choisir une catégorie --</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <input type='file' name='image' accept='image/*' onChange={handleFormChange} />
        <button type='submit'>Ajouter</button>
      </form>

      {/* Liste des produits avec bouton Modifier */}
      <div className='admin-products__list'>
        {products.map(prod => (
          <div key={prod._id} className='admin-products__item'>
            <img src={`${import.meta.env.VITE_API_URL}/${prod.image}`} alt={prod.name} />
            <h3>{prod.name}</h3>
            <p>{prod.description}</p>
            <p><strong>Prix :</strong> {prod.price} €</p>
            <p><strong>Catégorie :</strong> {prod.category?.name || 'Non définie'}</p>
            <button onClick={() => openModal(prod)}>Modifier</button>
          </div>
        ))}
      </div>

      {/* Modale de modification */}
      {isModalOpen && editProduct && (
        <div className='admin-products__modal'>
          <form onSubmit={handleEditSubmit}>
            <input type='text' name='name' value={editProduct.name} onChange={handleEditChange} />
            <textarea name='description' value={editProduct.description} onChange={handleEditChange} />
            <input type='text' name='ingredients' value={editProduct.ingredients} onChange={handleEditChange} />
            <input type='text' name='allergens' value={editProduct.allergens} onChange={handleEditChange} />
            <input type='number' name='price' value={editProduct.price} onChange={handleEditChange} />
            <select name='category' value={editProduct.category} onChange={handleEditChange} required>
              <option value=''>-- Choisir une catégorie --</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <label>
              <input type='checkbox' name='available' checked={editProduct.available} onChange={handleEditChange} />
              Disponible
            </label>

            {/* Affichage des modificateurs par type */}
            <div className='modifiers-group'>
              {['option', 'sauce', 'supplément'].map(type => (
                modifiersByType[type].length > 0 && (
                  <div key={type}>
                    <strong>{type.charAt(0).toUpperCase() + type.slice(1)}s</strong>
                    {modifiersByType[type].map(mod => (
                      <label key={mod._id}>
                        <input
                          type='checkbox'
                          name='modifiers'
                          value={mod._id}
                          checked={editProduct.modifiers.includes(mod._id)}
                          onChange={handleEditChange}
                        />
                        {mod.name}
                      </label>
                    ))}
                  </div>
                )
              ))}
            </div>

            <input type='file' name='image' accept='image/*' onChange={handleEditChange} />
            <button type='submit'>Valider</button>
            <button type='button' onClick={handleDelete}>🗑️ Supprimer</button>
            <button type='button' onClick={() => setIsModalOpen(false)}>Annuler</button>
          </form>
        </div>
      )}
    </main>
  )
}

export default AdminProduct
