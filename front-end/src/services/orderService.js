import { get, post } from "../utils/request";

export const getOrderByUserId = async (userId) => {
    const result = await get(`orders/users/${userId}`);
    return result;
}

export const createNewOrder = async (options, userId) => {
    const result = await post(options, `orders?userId=${userId}`);
    return result;
}