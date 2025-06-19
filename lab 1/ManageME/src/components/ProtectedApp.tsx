import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import ProjectList from "./ProjectList";
import StoryList from "./StoryList";
import KanbanBoard from "./KanbanBoard";

const ProtectedContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginForm />;
  return (
    <>
      <ProjectList />
      <StoryList />
      <KanbanBoard />
    </>
  );
};

const ProtectedApp: React.FC = () => (
  <AuthProvider>
    <ProtectedContent />
  </AuthProvider>
);

export default ProtectedApp;