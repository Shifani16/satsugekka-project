import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Intro from "./component/intro";
import Home from "./component/home";
import Navbar from "./component/navbar";
import Blog from "./component/blog";
import Translation from "./component/translation";
import About from "./component/about";
import Footer from "./component/footer";
import BlogPostDetail from "./component/reusable/BlogPostDetail";
import TranslationDetail from "./component/reusable/TranslationDetail";
import Login from "./component/admin/login";
import Sidebar from "./component/admin/sidebar";
import MyBlog from "./component/admin/myBlog";
import Setting from "./component/admin/setting";
import CreateTrans from "./component/admin/createTrans";
import MyTrans from "./component/admin/myTrans";
import ProtectedRoute from "./component/admin/ProtectedRoute";
import CreateBlog from "./component/admin/createBlog";

function AppContent({ showIntro }: { showIntro: boolean }) {
  const location = useLocation();
  const adminPaths = [
    "/vani",
    "/create-blog",
    "/my-blog",
    "/setting-char",
    "/create-translation",
    "/my-translation",
  ];
  const isExcludedPage = adminPaths.includes(location.pathname);

  const showSidebar = isExcludedPage && location.pathname !== "/vani";

  return (
    <div className={showSidebar ? "flex min-h-screen" : ""}>
      {showIntro && !isExcludedPage && <Intro />}

      {showSidebar ? <Sidebar /> : !isExcludedPage && <Navbar />}

      <div className={showSidebar ? "flex-1 p-8" : "content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogPostDetail />} />
          <Route path="/translation" element={<Translation />} />
          <Route
            path="/translation/:translation_id"
            element={<TranslationDetail />}
          />
          <Route path="/about" element={<About />} />

          <Route path="/vani" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/my-blog" element={<MyBlog />} />
            <Route path="/setting-char" element={<Setting />} />
            <Route path="/create-translation" element={<CreateTrans />} />
            <Route path="/my-translation" element={<MyTrans />} />
          </Route>
        </Routes>
      </div>

      {!isExcludedPage && <Footer />}
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
    }

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1000);

    return () => {
      clearTimeout(timer);

      document.body.style.overflow = "unset";
    };
  }, [showIntro]);

  return (
    <BrowserRouter>
      <AppContent showIntro={showIntro} />
    </BrowserRouter>
  );
}

export default App;
