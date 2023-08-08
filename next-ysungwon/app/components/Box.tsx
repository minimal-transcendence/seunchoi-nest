import { ReactNode, useState } from "react";
import styles from "./Box.module.css"

type BoxProps = {
    children: ReactNode;
}


export default function Box({ children }: BoxProps) {
    const [isOpen, setIsOpen] = useState(true);
  
    return (
      <div className={`${styles.box} ${styles.box__search__list}`}>
        <button className={styles.btn__toggle} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>
    );
}