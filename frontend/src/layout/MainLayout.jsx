import Header from "./Header";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="main-wrapper-layout">
      <Header />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      <BottomNav />
    </div>
  );
}

export default MainLayout;
