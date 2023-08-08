'use client'

import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import styles from "./Home.module.css";
import Box from "./components/Box";
import SearchList from "./components/SearchList";
import ChatRoomUser from "./components/ChatRoomUser";

const SEARCH_REQUIRE_ERROR = "Need Search Query!";
const NO_SEARCH_RESULT_ERROR = "There is no room! : ";
const CLIENTNAME = "ysungwon";

export type UserOnChat = {
  id: string;
  isCreator: boolean;
  isOp: boolean;
}

export type TempSearch = {
  roomName: string;
  messageShort: string;
  messageNew: boolean;
  users: UserOnChat[];
}

const tempSearchList = [
  {
    roomName: "전체채팅방",
    messageShort:
      "전체채팅 ㅅㅅㅅㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ채팅이 기니까 화면도 길어지는 거 같다. 몇글자만 짤라서, 화면에는 2줄만 보이도록 설정을 해야 될 거 같다.",
    messageNew: true,
    users: [
      {
        id: "God",
        isCreator: true,
        isOp: true
      },
      {
        id: "ysungwon",
        isCreator: false,
        isOp: false
      },
      {
        id: "jaeyjeon",
        isCreator: false,
        isOp: false
      },
      {
        id: "namkim",
        isCreator: false,
        isOp: false
      },
      {
        id: "seunchoi",
        isCreator: false,
        isOp: false
      },
      { id: "ProGamer", isCreator: false, isOp: false }
    ]
  },
  {
    roomName: "게임채팅방",
    messageShort: "게임해야지 히히히",
    messageNew: true,
    users: [
      { id: "ProGamer", isCreator: true, isOp: true },
      {
        id: "ysungwon",
        isCreator: false,
        isOp: true
      },
      {
        id: "seunchoi",
        isCreator: false,
        isOp: true
      }
    ]
  },
  {
    roomName: "프론트엔드 방",
    messageShort: "프론트는 메세지 읽었다. JavaScript, 채팅,React,Pong",
    messageNew: false,
    users: [
      {
        id: "jaeyjeon",
        isCreator: true,
        isOp: true
      },
      {
        id: "ysungwon",
        isCreator: false,
        isOp: true
      }
    ]
  },
  {
    roomName: "백엔드 방",
    messageShort: "백엔드는 메세지를 안 읽었다..",
    messageNew: true,
    users: [
      {
        id: "namkim",
        isCreator: false,
        isOp: false
      },
      {
        id: "seunchoi",
        isCreator: false,
        isOp: true
      }
    ]
  },
  {
    roomName: "안식처",
    messageShort: "에어컨...조아..",
    messageNew: false,
    users: [
      {
        id: "ysungwon",
        isCreator: true,
        isOp: true
      }
    ]
  }
];
const tempRoomUserList = [
  {
    id: "ysungwon",
    isCreator: true,
    isOp: true
  },
  {
    id: "jaeyjeon",
    isCreator: false,
    isOp: false
  },
  {
    id: "namkim",
    isCreator: false,
    isOp: false
  },
  {
    id: "seunchoi",
    isCreator: false,
    isOp: true
  }
];

export default function Home() {
  
  const [results, setTempSearchList] = useState<TempSearch[]>([]);
  const [users, setTempRoomUserList] = useState(tempRoomUserList);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [curOpen, setCurOpen] = useState<number>(0);
  const tmpQuery = "방";

  function handleSelectRoom(room: any) {
    setSelectedRoom(room);
    setCurOpen(0);
    console.log("in handleSelectRoom ", room);
  }

  useEffect(
    function () {
      async function fetchResults() {
        try {
          setIsLoading(true);

          if (query === "#all") {
            setTempSearchList(tempSearchList);
            setSelectedRoom(null);
            setError("");
          } else if (!query) {
            // throw new Error(SEARCH_REQUIRE_ERROR);
            const tempResults = tempSearchList.filter((result) => {
              return (
                result.users.filter((user) => user.id === CLIENTNAME).length ===
                1
              );
            });

            if (tempResults.length === 0) {
              setSelectedRoom(null);
              throw new Error(NO_SEARCH_RESULT_ERROR + query);
            }
            setSelectedRoom(null);
            setTempSearchList(() => tempResults);
            setError("");
          } else {
            const tempResults = tempSearchList.filter((result) =>
              result.roomName.includes(query)
            );
            if (tempResults.length === 0) {
              setSelectedRoom(null);
              throw new Error(NO_SEARCH_RESULT_ERROR + query);
            }
            setSelectedRoom(null);
            setTempSearchList(() => tempResults);
            setError("");
          }
        } catch (err: any) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchResults();
    },
    [query]
  );

  return (
    <>
      <NavBar query={query} setQuery={setQuery}/>
      <main className={styles.main}>
        <Box>
          {!error && (
            <SearchList
              results={results}
              query={query}
              onSelectRoom={handleSelectRoom}
            />
          )}
          {error &&
            <p className={styles.error}>
              <span>📛</span>
              {error}
            </p>
          }
        </Box>

        <div className={`${styles.box} ${styles.box__center}`}>Game or Chat</div>

        <Box>
          {(selectedRoom?.users && selectedRoom?.roomName) ?
            <>
            <div className={styles.summary}>
              <h2>{selectedRoom?.roomName} 유저목록</h2>
            </div>
      
            <ul className={`${styles.list} ${styles.list__users}`}>
              {selectedRoom?.users.map((user: any, i: number) => (
                <ChatRoomUser
                  user={user}
                  key={user.id}
                  curOpen={curOpen}
                  onOpen={setCurOpen}
                  num={i}
                />
              ))}
            </ul>
          </> 
          : null
          }
        </Box>
      </main>
    </>
  )
}
