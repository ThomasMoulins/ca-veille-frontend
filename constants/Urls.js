import axios from "axios";
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

/*=============== CATEGORIES ===============*/
export const getHomeCategories = async (followedUsers) => {
    const newArray = followedUsers.join(",");
    const response = await axios.get(
        `${backendUrl}/categories/home?ids=${newArray}`
    );
    return response.data;
};

export const getCategories = async (categories) => {
    const newArray = categories.join(",");
    const response = await axios.get(
        `${backendUrl}/categories/categoriesId?ids=${newArray}`
    );
    return response.data;
};
export const getFollowedCategories = async (followedUsers) => {
    const newArray = followedUsers.join(",");
    const response = await axios.get(
        `${backendUrl}/categories/usersId?ids=${newArray}`
    );
    return response.data;
};

export const getPopulars = async () => {
    const response = await axios.get(`${backendUrl}/categories/populars`);
    return response.data;
};

export const createCategory = async (name, color) => {
    const response = await axios.post(`${backendUrl}/categories/newCategory`, {
        name,
        color,
    });
    return response.data;
};

export const updateCategory = async (name, color, categoryId) => {
    const response = await axios.put(`${backendUrl}/categories/update`, {
        categoryId,
        color,
        name,
    });
    return response.data;
};

export const createDefaultCategories = async (categoriesNames) => {
    const response = await axios.post(`${backendUrl}/categories/default`, {
        categoriesNames,
    });
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await axios.delete(
        `${backendUrl}/categories/${categoryId}`
    );
    return response.data;
};

/*=============== USERS ===============*/
export const getEmail = async () => {
    const response = await axios.get(`${backendUrl}/users/email`);
    return response.data;
};

export const toggleIsPublic = async () => {
    const response = await axios.put(`${backendUrl}/users/isPublic`);
    return response.data;
};

export const createFeed = async (url, categoryId) => {
    const response = await axios.post(`${backendUrl}/feeds/create`, {
        url,
        categoryId,
    });
    return response.data;
};

export const deleteUser = async () => {
    const response = await axios.delete(`${backendUrl}/users`);
    return response.data;
};

export const deleteFollowedUser = async (followedUserId) => {
    const response = await axios.delete(
        `${backendUrl}/users/followed/${followedUserId}`
    );
    return response.data;
};

export const addFollowedUser = async (userToFollowId) => {
    const response = await axios.post(
        `${backendUrl}/users/followed/${userToFollowId}`
    );
    return response.data;
};

export const changeUsername = async (newUsername) => {
    const response = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users`,
        {
            newUsername,
        }
    );
    return response.data;
};

/*=============== ARTICLES ===============*/

export const toggleFavoriteArticle = async (articleyId) => {
    const response = await axios.put(
        `${backendUrl}/articles/favorites/${articleyId}`
    );
    return response.data;
};

export const getFavoritesArticles = async (favoriteArticles) => {
    const newArray = favoriteArticles.join(",");
    const response = await axios.get(
        `${backendUrl}/articles/favoritesArticlesId?ids=${newArray}`
    );
    return response.data;
};

export const handleDeleteUserCategory = async (categoryId) => {
    const response = await axios.delete(
        `${backendUrl}/users/category/${categoryId}`
    );
    return response.data;
};

/*=============== FEEDS ===============*/

export const getFeedsByCategory = async (categoryId) => {
    const response = await axios.get(`${backendUrl}/feeds/${categoryId}`);
    return response.data;
};

export const getAllFeedsWithCategories = async () => {
    const response = await axios.get(`${backendUrl}/feeds`);
    return response.data;
};

export const deleteFeedFromCategory = async (categoryId, feedId) => {
    const response = await axios.delete(
        `${backendUrl}/categories/${categoryId}/feed/${feedId}`
    );
    return response.data;
};
