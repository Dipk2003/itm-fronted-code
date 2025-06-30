import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Medicines from "../pages/Medicines";
import Projector from "../pages/Projector";
import Solarpanel from "../pages/Solarpanel";
import Admin from "./ADMIN/admin";
import Cart from "./Cart";
import ProductDetails from "./ProductDetails";
import SearchPageDetails from "./SearchPageDetails";
import PrivateRoute from "../HOC/PrivateRoute";
import AboutUs from "../pages/AboutUs";
import Press from "../pages/Press";
import ContactUs from "../pages/ContactUs";
import Career from "../pages/Career"



const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AboutUS" element={<AboutUs />} />
      <Route path="/Career" element={<Career />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/Press" element={<Press />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/productDetails/:id" element={<ProductDetails />} />
      <Route path="/searchProduct/:query" element={<SearchPageDetails />} />
      <Route
        path="/Medicines"
        element={
        
           <PrivateRoute><Medicines /></PrivateRoute> 
          
        }
      />
      <Route
        path="/solar"
        element={
          <PrivateRoute><Solarpanel /></PrivateRoute>
            
          
        }
      />
      <Route
        path="/Projector"
        element={
          <PrivateRoute> <Projector /></PrivateRoute>
           
          
        }
      />
    </Routes>
  );
};

export default Allroutes;
