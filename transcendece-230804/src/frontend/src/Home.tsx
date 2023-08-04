import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import AuthContext from './context/AuthContext';
import UserList from './UserList';

interface User {
	"id": number,
    "nickname": string,
    "email": string,
    "avatar": string,
    "score": number,
    "createdAt": string,
    "lastLogin": string,
    "friends": number[],
    "refreshToken": string,
    "tokenExp": string,
    "otpSecret": string,
    "is2faEnabled": boolean
}

function Home(){
	const navigate = useNavigate();

	const greeting:string[] = ["hihi", "hello" , "안녕"];
	const [number, setNumber] = useState(0);
	const { isLoggedIn, logout, setIsLoggedIn } = useContext(AuthContext);

	const [user, setUser] = useState<User>();
	const getUser = async () => {
		const json = await (
			await fetch(
				"http://localhost/api/user/99976"
			)
		).json();
		setUser(json);
	}

	function onIncrease(){
		setNumber(number + 1);
	}

	// getImage();

	// 이미 로그인되었는지 확인
	useEffect(() => {
	// 예시로 sessionStorage에 isLoggedIn 상태를 저장한 것으로 가정
	const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
	if (storedIsLoggedIn === 'true') {
		setIsLoggedIn(true);
	}
	getUser();
	}, []);

	if (!isLoggedIn) {
		// 로그인 상태가 아닐 경우, 로그인 페이지로 이동
		return (
			<div>
				<p>로그인이 필요합니다. 로그인 페이지로 이동합니다.</p>
				<button onClick={() => navigate('/')}>Go to Home</button>
			</div>
		)
	}
	else if (user) {
		return (
			<div>
				<div>
					<button onClick={onIncrease}>인사 바꾸기</button>
					<button onClick={logout}>로그 아웃</button>
					<h1>홈</h1>
					<p>이곳은 홈이에요, 가장 먼저 보여주는 페이지임</p>
					<p>{greeting[number % 3]}</p>
				</div>
				<div>
				<img src={user.avatar} />
				<UserList />
				</div>
			</div>
		);
	}
	else{
		return (
			<div>
				<div>
					<button onClick={onIncrease}>인사 바꾸기</button>
					<button onClick={logout}>로그 아웃</button>
					<h1>홈</h1>
					<p>이곳은 홈이에요, 가장 먼저 보여주는 페이지임</p>
					<p>{greeting[number % 3]}</p>
				</div>
				<div>
				<UserList />
				</div>
			</div>
		);
	}
};

export default Home;
