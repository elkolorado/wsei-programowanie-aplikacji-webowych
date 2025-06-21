import React from "react";
import { UserService } from "../services/UserService";
import type { User } from "../models/User";
import { useAuth } from "../context/AuthContext";

const UserProfile: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const { logout } = useAuth();

    React.useEffect(() => {
        UserService.getLoggedInUser().then(setUser);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            {user ? (
                <>
                    Logged in as: <span id="loggedInUserFirstLastName">{user.firstName} {user.lastName}</span> ({user.role}){" "}
                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <>No user is logged in.</>
            )}
        </div>
    );
};

export default UserProfile;