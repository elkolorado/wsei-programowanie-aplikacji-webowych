export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export const UserService = class {
  private static loggedInUser: User = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
  };

  static getLoggedInUser(): User {
    return this.loggedInUser;
  }
};