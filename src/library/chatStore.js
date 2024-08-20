import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  chatId: null,
  user: null,
  currentUser: {}, // Add currentUser to the initial state
  isCurrentUserBlocked: false,
  isCurrentReceiverBlocked: false,
  setLoadingSignIn: true,
  changeChat: (chatId, user) => {
    const currentUser = get().currentUser; // Get the currentUser from the state

    if (!Array.isArray(user.blocked)) {
      user.blocked = [];
    }

    if (!Array.isArray(currentUser.blocked)) {
      currentUser.blocked = [];
    }

    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isCurrentReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isCurrentReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isCurrentReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({
      ...state,
      isCurrentReceiverBlocked: !state.isCurrentReceiverBlocked,
    }));
  },
  setCurrentUser: (user) => {
    set({ currentUser: user }); // Method to set the current user
  },
}));
