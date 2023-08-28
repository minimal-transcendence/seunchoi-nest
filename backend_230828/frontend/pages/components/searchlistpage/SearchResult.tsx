import { useEffect, useState, useContext } from "react";
import { SocketContext } from "@/pages/App";
export default function SearchResult({
  el,
  onSelectRoom,
  blocklist,
}: {
  el: any;
  onSelectRoom: any;
  blocklist: any;
}) {
  const socket = useContext(SocketContext);
  console.log(
    `blocklist ${blocklist}, el?.lastMessageFrom ${
      el?.lastMessageFrom
    } includes ${!blocklist?.includes(el?.lastMessageFrom)}`
  );
  return (
    <li onClick={() => onSelectRoom(event, el)}>
      <div>
        <h3>{el?.roomname}</h3>
      </div>
      <div>
        <p>
          {!blocklist?.includes(el?.lastMessageFrom) ? (
            <>
              <span>{el?.messageNew ? "🆕" : "☑️"}</span>
              <span>
                {el?.lastMessage?.length >= 14
                  ? el?.lastMessageFrom +
                    " : " +
                    el?.lastMessage.substr(0, 14) +
                    "..."
                  : el?.lastMessage}
              </span>
            </>
          ) : (
            <>
              <span>제한된 메세지입니다.</span>
            </>
          )}
        </p>
      </div>
    </li>
  );
}
