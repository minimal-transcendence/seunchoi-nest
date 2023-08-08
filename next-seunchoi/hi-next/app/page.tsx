import Link from 'next/link'
import NavBar from './components/NavBar'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.home}>

      <Link href="/home">
        <img
            className={styles.logo}
            src="42_Logo.svg.png"
            alt="42 Seoul"
        />
      </Link>

      <NavBar/>

      <hr className={styles.line__2}/>
      {/* <hr className={styles.line__3}/>
      <hr className={styles.line__4}/> */}


    </div>
  )
}
