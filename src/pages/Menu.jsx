import { useContext, useEffect } from 'react'
import { ProductContext } from '../context/productContext'
import { ProductCategoryContext } from '../context/productCategoryContext'
import { Link } from 'react-router-dom'
import '../styles/pages/Menu.scss'

function Menu() {
  // Accès aux produits et aux catégories depuis les contextes
  const { products, fetchProducts } = useContext(ProductContext)
  const { categories, fetchCategories } = useContext(ProductCategoryContext)

  // Chargement des produits et catégories au montage
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return (
    <div className='menu-page'>
      {/* Barre de navigation pour accéder directement à une catégorie */}
      <nav className='menu-nav'>
        {categories.map(cat => (
          <a key={cat._id} href={`#cat-${cat._id}`}>{cat.name}</a>
        ))}
      </nav>

      {/* Affichage des produits par catégorie */}
      {categories.map(cat => (
        <section key={cat._id} id={`cat-${cat._id}`} className='category-section'>
          <h2>{cat.name}</h2>
          <div className='grid-products'>
            {products
              .filter(p => p.category?._id === cat._id)
              .map(p => (
                <div key={p._id} className='product-card'>
                  <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <p className='price'>{p.price.toFixed(2)} €</p>
                </div>
              ))
            }
          </div>

          {/* Lien vers la page de commande */}
          <div className='section-footer'>
            <Link to='/commander' className='order-link'>Passer commande</Link>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Menu
