import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { start } from 'repl';

const Home = () => {
	const router = useRouter();

	useEffect(() => {
		router.push('Log');
		console.log("enter");
	},[])

	return(
		<div>
		</div>
	)
}

export default Home;
