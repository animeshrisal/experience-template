import { User } from "../model/User";

export const saveDataToLocalStorage = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const saveSyncInfo = (value: number) => {
    localStorage.setItem("isDataSynced", value.toString());
}

export const getDataFromLocalStorage = () : User | null=> {
    const user = localStorage.getItem("user");

    if (user) {
        return JSON.parse(user)
    }

    return null;
}

export const clearLocalStorage = () => {
    localStorage.removeItem("user")
}