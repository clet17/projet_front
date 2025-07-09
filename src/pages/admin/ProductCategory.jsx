import { useContext, useState, useEffect } from 'react'
import { ProductCategoryContext } from '../../context/productCategoryContext'
import '../../styles/pages/AdminProductCategories.scss'
import AdminBackButton from '../../components/AdminBackButton'

function AdminProductCategories() {
  // Récupération des fonctions et données depuis le contexte
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useContext(ProductCategoryContext)

  // État pour le formulaire de création
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: null })

  // État pour la catégorie à modifier
  const [editCategory, setEditCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Chargement des catégories à l’ouverture de la page
  useEffect(() => {
    fetchCategories()
  }, [])

  // Gestion des changements dans le formulaire de création
  const handleChange = (e) => {
    const { name, value, files } = e.target
    setNewCategory(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  // Envoi du formulaire pour créer une nouvelle catégorie
  const handleCreate = async (e) => {
    e.preventDefault()
    await createCategory(newCategory)
    setNewCategory({ name: '', description: '', image: null })
  }

  // Ouverture de la modale de modification
  const openModal = (category) => {
    setEditCategory(category)
    setIsModalOpen(true)
  }

  // Gestion des changements dans le formulaire de modification
  const handleEditChange = (e) => {
    const { name, value, files } = e.target
    setEditCategory(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  // Envoi des modifications
  const handleUpdate = async (e) => {
    e.preventDefault()
    await updateCategory(editCategory._id, editCategory)
    setIsModalOpen(false)
  }

  // Suppression de la catégorie sélectionnée
  const handleDelete = async () => {
    const confirm = window.confirm('Supprimer cette catégorie ?')
    if (confirm) {
      await deleteCategory(editCategory._id)
      setIsModalOpen(false)
    }
  }

  return (
    <div className='admin-categories'>
      <AdminBackButton />
      <h2>Catégories de produits</h2>

      {/* Formulaire pour ajouter une nouvelle catégorie */}
      <form onSubmit={handleCreate} className='admin-categories__form'>
        <input type='text' name='name' placeholder='Nom' value={newCategory.name} onChange={handleChange} required />
        <input type='text' name='description' placeholder='Description' value={newCategory.description} onChange={handleChange} required />
        <input type='file' name='image' onChange={handleChange} />
        <button type='submit'>Ajouter</button>
      </form>

      {/* Liste des catégories existantes */}
      <ul className='admin-categories__list'>
        {categories && categories.map(category => (
          <li key={category._id} className='admin-categories__item'>
            <img src={`${import.meta.env.VITE_API_URL}/${category.image}`} alt={category.name} />
            <div>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
              <button onClick={() => openModal(category)}>Modifier</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modale de modification d’une catégorie */}
      {isModalOpen && editCategory && (
        <div className='admin-categories__modal'>
          <form onSubmit={handleUpdate}>
            <input type='text' name='name' value={editCategory.name} onChange={handleEditChange} />
            <input type='text' name='description' value={editCategory.description} onChange={handleEditChange} />
            <input type='file' name='image' onChange={handleEditChange} />
            <button type='submit'>Valider</button>
            <button type='button' onClick={handleDelete}>🗑️ Supprimer</button>
            <button type='button' onClick={() => setIsModalOpen(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminProductCategories
