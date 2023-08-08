'use client'

//참고 - https://mycodings.fly.dev/blog/2022-11-17-nextjs-13-client-component

import React, { FormEvent, useState } from "react"
import styles from "./Search.module.css"

export default function Search() {
    const [search, setSearch] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearch('');
        console.log("submit!!");
    }


    return (
        <form onSubmit={handleSubmit}>
            <input
                className={styles.search__bar}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="유저 검색"
            />
        </form>
    );
}