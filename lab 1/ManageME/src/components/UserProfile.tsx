import React from "react";
import { UserService, type User } from "../services/UserService";

// Mock users and set the logged-in user
UserService.mockUsers();
const user: User | null = UserService.getLoggedInUser();

const UserProfile: React.FC = () => {
    return (
        <div>
            {user ? (
                <>
                    Logged in as: {user.firstName} {user.lastName} ({user.role})
                </>
            ) : (
                <>No user is logged in.</>
            )}
        </div>
    );
};

export default UserProfile;