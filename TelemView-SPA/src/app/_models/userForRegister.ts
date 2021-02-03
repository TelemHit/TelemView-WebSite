//model of user for registration

export interface UserForRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    clientURI: string;
}
