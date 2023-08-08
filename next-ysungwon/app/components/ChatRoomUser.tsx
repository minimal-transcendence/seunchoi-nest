import type { UserOnChat } from '../page';
import styles from "./ChatRoomUser.module.css"

type ChatRoomUserProps = {
    user: UserOnChat;
    curOpen: number;
    onOpen: Function;
    num: number;
}

export default function ChatRoomUser({
    user,
    curOpen,
    onOpen,
    num
}: ChatRoomUserProps) {
    const CLIENTNAME = "ysungwon";
    const isOpen = num === curOpen;
  
    function handleToggle() {
      console.log(isOpen, num, curOpen);
  
      onOpen(() => {
        if (isOpen) return null;
        else return num;
      });
    }
  
    return (
      <li className={`${styles.item} ${isOpen ? styles.open : ""}`} onClick={handleToggle}>
        <p className={styles.number}>{num < 9 ? `0${num + 1}` : `${num + 1}`}</p>
        <p>
          {user.id} {user.id === CLIENTNAME ? "🎆" : ""}
        </p>
        <p className={styles.icon}>{isOpen ? "-" : "+"}</p>
  
        {isOpen && (
          <div className={styles.content__box}>
            <>
              <div>
                <p>
                  <span>생성자</span>
                  <span>{user.isCreator ? "🟣" : "✖️"}</span>
                  <span>방장 </span>
                  <span>{user.isOp ? "🟣" : "✖️"}</span>
                </p>
              </div>
              <div>
                <span>kick</span>
              </div>
              <div>
                <span>방장권한주기</span>
              </div>
              <div>
                <span>mute</span>
              </div>
            </>
          </div>
        )}
      </li>
    );
}