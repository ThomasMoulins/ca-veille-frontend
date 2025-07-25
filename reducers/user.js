import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        username: null,
        token: null,
        categories: [],
        favoriteArticles: [],
        followedUsers: [],
        isPublic: false,
    },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
            state.value.categories = action.payload.categories;
            state.value.favoriteArticles = action.payload.favoriteArticles;
            state.value.followedUsers = action.payload.followedUsers;
            state.value.isPublic = action.payload.isPublic;
        },
        logout: (state, action) => {
            state.value.username = null;
            state.value.token = null;
            state.value.categories = [];
            state.value.favoriteArticles = [];
            state.value.followedUsers = [];
            state.value.isPublic = false;
        },
        toggleFavorite: (state, action) => {
            if (
                state.value.favoriteArticles.includes(action.payload.articleId)
            ) {
                state.value.favoriteArticles =
                    state.value.favoriteArticles.filter(
                        (id) => id !== action.payload.articleId
                    );
            } else {
                state.value.favoriteArticles.push(action.payload.articleId);
            }
        },
        toggleIsPublicReducer: (state, action) => {
            state.value.isPublic = action.payload;
        },
        setCategories: (state, action) => {
            state.value.categories = action.payload;
        },
        addCategory: (state, action) => {
            state.value.categories.push(action.payload);
        },
        deletCategory: (state, action) => {
            state.value.categories = state.value.categories.filter(
                (id) => id !== action.payload
            );
        },
        followUser: (state, action) => {
            state.value.followedUsers.push(action.payload.userId);
        },
        unfollowUser: (state, action) => {
            state.value.followedUsers = state.value.followedUsers.filter(
                (id) => id !== action.payload.userId
            );
        },
        deleteUserCategory: (state, action) => {
            state.value.categories = action.payload;
        },
        updateUsername: (state, action) => {
            state.value.username = action.payload;
        },
    },
});

export const {
    addUser,
    logout,
    toggleFavorite,
    toggleIsPublicReducer,
    setCategories,
    addCategory,
    followUser,
    unfollowUser,
    deletCategory,
    deleteUserCategory,
    updateUsername,
} = userSlice.actions;
export default userSlice.reducer;
