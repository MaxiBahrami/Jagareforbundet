import { 
  createBrowserRouter, 
  RouterProvider, 
  Outlet,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Footer from "./components/Footer";
import CustomNavbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React, { useContext } from "react";
import { AuthContext } from "./context/authContext";

const Layout = ()=>{
  return (
    <>
    <CustomNavbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

const PrivateRoute = ({ element, path }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Routes>
      <Route path={path} element={element} />
    </Routes>
  ) : (
    <Navigate to="/login" />
  );
};

const router =createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <Home /> }, 
      { path: "/write/*", 
        element: (<PrivateRoute path="/*" element={<Write />} /> )},
      {
        path: "/post/:id/*",
        element: (
          <PrivateRoute path="/" element={<Single />} />
        )
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}



export default App;
