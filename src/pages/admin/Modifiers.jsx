import { useContext, useState, useEffect } from 'react'
import { ModifierContext } from '../../context/modifierContext'
import '../../styles/pages/AdminModifiers.scss'
import AdminBackButton from '../../components/AdminBackButton'

function AdminModifier() {
  const {
    modifiers,
    fetchModifiers,
    createModifier,
    updateModifier,
    deleteModifier
  } = useContext(ModifierContext)

  const [newModifier, setNewModifier] = useState({
    name: '',
    type: 'option',
    price: '',
    image: null
  })

  const [editModifier, setEditModifier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchModifiers()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setNewModifier(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await createModifier(newModifier)
    setNewModifier({ name: '', type: 'option', price: '', image: null })
  }

  const openModal = (modifier) => {
    setEditModifier(modifier)
    setIsModalOpen(true)
  }

  const handleEditChange = (e) => {
    const { name, value, files } = e.target
    setEditModifier(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await updateModifier(editModifier._id, editModifier)
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    const confirm = window.confirm('Supprimer ce modificateur ?')
    if (confirm) {
      await deleteModifier(editModifier._id)
      setIsModalOpen(false)
    }
  }

  return (
    <div className='admin-modifier'>
      <AdminBackButton />
      <h1>Gestion des modificateurs</h1>

      <form onSubmit={handleCreate} className='admin-modifier__form'>
        <input type='text' name='name' placeholder='Nom' value={newModifier.name} onChange={handleChange} required />
        <select name='type' value={newModifier.type} onChange={handleChange}>
          <option value='option'>Option</option>
          <option value='sauce'>Sauce</option>
          <option value='supplément'>Supplément</option>
        </select>
        <input type='number' name='price' placeholder='Prix' value={newModifier.price} onChange={handleChange} required />
        <input type='file' name='image' accept='image/*' onChange={handleChange} />
        <button type='submit'>Ajouter</button>
      </form>

      <ul className='admin-modifier__list'>
        {modifiers.map(mod => (
          <li key={mod._id} className='admin-modifier__item'>
            <img src={`${import.meta.env.VITE_API_URL}/${mod.image}`} alt={mod.name} />
            <div>
              <strong>{mod.name}</strong>
              <p>{mod.type}</p>
              <p>{mod.price} €</p>
              <button onClick={() => openModal(mod)}>Modifier</button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && editModifier && (
        <div className='admin-modifier__modal'>
          <form onSubmit={handleUpdate}>
            <input type='text' name='name' value={editModifier.name} onChange={handleEditChange} />
            <select name='type' value={editModifier.type} onChange={handleEditChange}>
              <option value='option'>Option</option>
              <option value='sauce'>Sauce</option>
              <option value='supplément'>Supplément</option>
            </select>
            <input type='number' name='price' value={editModifier.price} onChange={handleEditChange} />
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

export default AdminModifier
