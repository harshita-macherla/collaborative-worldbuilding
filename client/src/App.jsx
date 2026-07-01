import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateWorld from "./pages/CreateWorld";
import WorldDetail from "./pages/WorldDetail";
import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import ProtectedRoute from "./components/ProtectedRoute";
import WorldMap from "./pages/WorldMap";
import CharactersPage from "./pages/CharactersPage";
import TimelinePage from "./pages/TimelinePage";
import EditArticle from "./pages/EditArticle"; 

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/create-world" element={<ProtectedRoute><CreateWorld /></ProtectedRoute>} />
      <Route path="/worlds/:id" element={<ProtectedRoute><WorldDetail /></ProtectedRoute>} />
      <Route path="/worlds/:worldId/articles" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
      <Route path="/worlds/:worldId/articles/new" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
      <Route path="/articles/:id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/worlds/:worldId/map" element={<ProtectedRoute><WorldMap /></ProtectedRoute>} />
      <Route path="/worlds/:worldId/characters" element={<ProtectedRoute><CharactersPage /></ProtectedRoute>} />
      <Route path="/worlds/:worldId/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
      <Route path="/articles/:id/edit" element={<ProtectedRoute><EditArticle /></ProtectedRoute>} />
    </Routes>
  );
}