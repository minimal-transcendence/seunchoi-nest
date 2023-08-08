import Link from "next/link";
import styles from "./NavBar.module.css"
import Search from "./Search";
import Toggle from "./Toggle";

export default function NavBar() {
    return (
        <div>
            <Search/>
            <Link
                className={styles.user__list}
                href="/user"
                >
                유저 목록
            </Link>
            <Link
                className={styles.my__page}
                href="/mypage"
                >
                내 정보
            </Link>
            <Link
                className={styles.logout}
                href="/logout"
                >
                로그아웃
            </Link>
            <Toggle/>
        </div>
    );
}