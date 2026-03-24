import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LoginComponent/LandingPage";
import LoginPage from "./components/LoginComponent/LoginPage";
import RegisterUser from "./components/LoginComponent/RegisterUser";
import AdminMenu from "./components/LoginComponent/AdminMenu";
import StudentMenu from "./components/LoginComponent/StudentMenu";
import LostItemRegistration from "./components/ItemComponent/LostItemRegistration";
import "./App.css";
import LostItemList from "./components/ItemComponent/LostItemList";
import PersonalDetails from "./components/ItemComponent/PersonalDetails";
import FoundItemRegistration from "./components/ItemComponent/FoundItemRegistration";
import ViewFoundItems from "./components/ItemComponent/ViewFoundItems";
import MatchItemsPage from "./components/ItemComponent/MatchItemsPage";
import ChatMessage from "./components/ChatComponent/ChatMessage"; // ✅ fixed name
import AllStudents from "./components/LoginComponent/AllStudents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/login"                   element={<LoginPage />} />
        <Route path="/register"                element={<RegisterUser />} />
        <Route path="/admin-menu"              element={<AdminMenu />} />
        <Route path="/student-menu"            element={<StudentMenu />} />
        <Route path="/lost-item-registration"  element={<LostItemRegistration />} />
        <Route path="/view-lost-items"         element={<LostItemList />} />
        <Route path="/personal-details"        element={<PersonalDetails />} />
        <Route path="/found-item-registration" element={<FoundItemRegistration />} />
        <Route path="/view-found-items"        element={<ViewFoundItems />} />
        <Route path="/matches"                 element={<MatchItemsPage />} />
        <Route path="/chatting"                element={<ChatMessage />} /> {/* ✅ fixed */}
        <Route path="/all-students"            element={<AllStudents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
