export interface LoginForm {
    username: string;
    password: string;
}

export const UserInitialState: LoginForm = {
    username: "",
    password: "",
};