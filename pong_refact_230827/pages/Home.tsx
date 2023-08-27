import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserList from "../srcs/UserList";
import MyProfile from "../srcs/MyProfile";
import UserProfile from "../srcs/UserProfile";
import App from "./App";

function Home() {
  const router = useRouter();
  const [myProfileModal, setMyProfileModal] = useState<boolean>(false);
  const [userListModal, setUserListModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 이미 로그인되었는지 확인
  useEffect(() => {
    // 예시로 localStorage에 isLoggedIn 상태를 저장한 것으로 가정
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    // 로그인 상태가 아닐 경우, 로그인 페이지로 이동
    return (
      <div>
        <p>로그인이 필요합니다. 로그인 페이지로 이동합니다.</p>
        <button onClick={() => router.push("/")}>Go to Home</button>
      </div>
    );
  } else {
    return (
      <div>
        {/* <div>
          <button onClick={() => setMyProfileModal(true)}>내 프로필</button>
          <button onClick={() => setUserListModal(true)}>유저 목록</button>
          <button onClick={logout}>로그 아웃</button>
        </div>
        <div>
          {userListModal && (
            <>
              <button onClick={() => setUserListModal(false)}>닫기</button>
              <UserList />
            </> 
          )}
        </div>
        <div>
          {myProfileModal && (
            <>
              <button onClick={() => setMyProfileModal(false)}>닫기</button>
              <MyProfile />
            </>
          )}
        </div>
            <UserProfile id='1' />  */}
        <div>
          <App />
        </div>
      </div>
    );
  }
}

export default Home;
