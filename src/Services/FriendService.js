// FriendService.js
let friends = [];

export const FriendService = {
  addFriend(name) {
    const newFriend = { id: Date.now(), name };
    friends.push(newFriend);
  },
  removeFriend(id) {
    friends = friends.filter((friend) => friend.id !== id);
  },
  getFriends() {
    return friends;
  },
};