import { useContext, useEffect } from 'react'
import { ProductContext } from '../context/productContext'
import { ProductCategoryContext } from '../context/productCategoryContext'
import { Link } from 'react-router-dom'
import '../styles/pages/Menu.scss'

function Menu() {
  const { products, fetchProducts } = useContext(ProductContext)
  const { categories, fetchCategories } = useContext(ProductCategoryContext)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return (
    <div className='menu-page'>
      <nav className='menu-nav'>
        {categories.map(cat => (
          <a key={cat._id} href={`#cat-${cat._id}`}>{cat.name}</a>
        ))}
      </nav>

      {categories.map(cat => (
        <section key={cat._id} id={`cat-${cat._id}`} className='category-section'>
          <h2>{cat.name}</h2>
          <div className='grid-products'>
            {products.filter(p => p.category?._id === cat._id).map(p => (
              <div key={p._id} className='product-card'>
                <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} alt={p.name} />
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <p className='price'>{p.price.toFixed(2)} €</p>
              </div>
            ))}
          </div>
          <div className='section-footer'>
            <Link to='/commander' className='order-link'>Passer commande</Link>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Menu
