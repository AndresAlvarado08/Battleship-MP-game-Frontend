export interface User {
    username: string;
    password: string;
}

export const UserInitialState: User = {
    username: "",
    password: "",
};