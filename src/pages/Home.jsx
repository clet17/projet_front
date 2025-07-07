import '../styles/pages/Home.scss'


function Home() {
  return (
    <main className='home'>
      <section className='home__hero'>
        <img
          className='home__image'
          src='/assets/illustration.jpg'
          alt='Illustration du restaurant'
        />
        <div className='home__overlay'>
          <h1 className='home__title'>Bienvenue chez Beldi’z</h1>
          <p className='home__slogan'>Plats traditionnels à emporter, préparés avec amour</p>
        </div>
      </section>

      <section className='home__actions'>
        <img className='home__dish home__dish--left' src='/assets/plat1.jpg' alt='Plat 1' />

        <div className='home__buttons'>
          <a href='/menu' className='btn'>Menu</a>
          <a href='/commande' className='btn'>Commander</a>
          <a href='/profile' className='btn'>Mon profil</a>
        </div>

        <img className='home__dish home__dish--right' src='/assets/plat2.jpg' alt='Plat 2' />
      </section>
    </main>

  )
}

export default Home
