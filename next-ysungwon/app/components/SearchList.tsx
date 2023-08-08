import styles from "./SearchList.module.css";
import type { TempSearch } from "../page";  

type SearchListProps = {
    results: TempSearch[];
    query: string;
    onSelectRoom: Function;
}


export default function SearchList({
    results,
    query,
    onSelectRoom
}: SearchListProps) {
    if (!results) return;
    return (
        <>
        <div className={styles.summary}>
            <h2>{query ? "검색결과" : "참여목록"}</h2>
        </div>
        <ul className={`${styles.list} ${styles.list__rooms}`}>
            {results?.map((el) => (
                <li onClick={() => onSelectRoom(el)}>
                <h3>{el.roomName}</h3>
                <div>
                    <p>
                    <span>{el.messageNew ? "🆕" : "☑️"}</span>
                    <span>{el.messageShort}</span>
                    </p>
                </div>
                </li>
            ))}
        </ul>
        </>
    );
}