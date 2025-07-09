import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/cartContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import '../styles/pages/Payment.scss'

function Payment() {
  const { cart, cartTotal, clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  const stripe = useStripe()
  const elements = useElements()

  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/commander')
      return
    }

    const createIntent = async () => {
      try {
        // console.log('Total ', cartTotal)
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
          amount: cartTotal
        })
        setClientSecret(res.data.clientSecret)
      } catch (err) {
        setError('Failed to create payment intent')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    createIntent()
  }, [cartTotal, cart, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    })

    if (result.error) {
      console.error(result.error)
      setError('Payment failed')
    } else if (result.paymentIntent.status === 'succeeded') {
      try {
        const product_orders = cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price,
          comment: item.comment,
          modifiers: item.modifiers
        }))

        await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, {
          total_price: cartTotal,
          product_orders: JSON.stringify(product_orders)
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })

        clearCart()
        setSuccess(true)
      } catch (err) {
        console.error(err)
        setError('Payment succeeded but order failed')
      }
    }
  }

  if (loading) return <p>Loading payment...</p>
  if (error) return <p>{error}</p>

  if (success) {
    return (
      <div className='payment-page'>
        <h1>Paiement confirmé </h1>
        <p>Votre commande a bien été enregistrée.</p>
        <Link to='/commandes'>Voir mes commandes</Link>
      </div>
    )
  }

  return (
    <div className='payment-page'>
      <h1>Paiement sécurisé</h1>
      <form onSubmit={handleSubmit} className='payment-form'>
        <CardElement />
        <button type='submit' disabled={!stripe}>Pay {cartTotal.toFixed(2)} €</button>
      </form>
    </div>
  )
}

export default Payment