// FriendList.js
import React, { useState } from "react";
//import { FriendService } from "../services/FriendService";
import { FriendService } from "../Services/FriendService";
const FriendList = () => {
  const [friends, setFriends] = useState(FriendService.getFriends());
  const [newFriendName, setNewFriendName] = useState("");

  const handleAddFriend = () => {
    FriendService.addFriend(newFriendName);
    setFriends(FriendService.getFriends());
    setNewFriendName("");
  };

  const handleRemoveFriend = (id) => {
    FriendService.removeFriend(id);
    setFriends(FriendService.getFriends());
  };

  return (
    <div className="friend-list">
      <h3>Friend List</h3>
      <input
        type="text"
        value={newFriendName}
        onChange={(e) => setNewFriendName(e.target.value)}
        placeholder="Enter friend's name"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name}
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;