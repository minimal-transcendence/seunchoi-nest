import Link from "next/link";
import styles from "./NavBar.module.css"

type NavBarProps = {
    query: string;
    setQuery: Function;
};

export default function NavBar({
    query,
    setQuery
}: NavBarProps) {
return (
    <nav className={styles.nav__bar}>
        <div className={styles.logo}>
            <span role="img">🏓</span>
            <h1>42PONG</h1>
        </div>
        <input
            className={styles.search}
            type="text"
            placeholder="Search Room...(#all show every room)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.nav__bar__menu}>
            <div className={styles.nav__bar__menu__l}>
                <Link href="/user" className={styles.nav__userlist}>유저정보</Link>
                <Link href="/mypage" className={styles.nav__profile}>내 정보</Link>
                <Link href="/logout" className={styles.nav__logout}>로그아웃</Link>
            </div>
            <div className={styles.nav__bar__menu__r}>
                <div className={styles.nav__randmatch}>
                <input type="checkbox" id="switch" />
                <label htmlFor="switch">Toggle</label>
                </div>
            </div>
        </div>
    </nav>
);
}