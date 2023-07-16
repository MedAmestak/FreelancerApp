import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./ModifyInfo.scss";
import jwtDecode from "jwt-decode";
import upload from "../../utils/upload";
import { useContext } from "react";
import { UserContext } from "../../UserContext.jsx";




const ModifyInformation = ({ userId }) => {
  const navigate = useNavigate();
  const { userData, updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    img: "",
    country: "",
    phone: "",
    desc: "",
  });

  useEffect(() => {
    // Fetch the user's current information from the server and pre-fill the form fields
    const fetchUserInformation = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the JWT token in localStorage
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
    
        const response = await newRequest.get(`/users/${userId}`);
        const { username, email, img, country, phone, desc } = response.data;
        setFormData({ username, password, email, img, country, phone, desc });
      } catch (error) {
        console.log("Error fetching user information:", error);
      }
    };
    
    

    fetchUserInformation();
  }, [userId]);

  const handleChange = (e) => {
  if (e.target.name === "img") {
    setFormData({
      ...formData,
      img: e.target.files[0] || "",
    });
  } else {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Upload the image and obtain the image URL
    const imageUrl = await upload(formData.img);

    // Create a new form data object with the updated image URL
    const updatedFormData = {
      ...formData,
      img: imageUrl,
    };

    console.log("Form data before API request:", updatedFormData);
    const response = await newRequest.put("/modify-info", updatedFormData);
    console.log("Update response:", response.data);

    const { img } = response.data;

    setFormData({
      ...formData,
      img: img, // Update the image URL in the component state
    });

    updateUser({
      username: response.data.username,
      img: response.data.img,
    });

    await newRequest.post("/auth/logout");
    localStorage.removeItem("currentUser");
    updateUser({}); // Clear the user data in UserContext

    navigate("/"); // Redirect to the homepage or any other desired page after successful update
    window.scrollTo(0, 0);

  } catch (error) {
    console.log("Error updating user information:", error);
  }
};



  return (
    <div className="modify-information">
      <form onSubmit={handleSubmit}>
      <div className="left">
      <h1>Modify Information</h1>
        <label htmlFor="">Username:</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
          />
        <label htmlFor="">Password</label>
          <input 
           name="password" 
           type="password" 
           value={formData.password}
           onChange={handleChange} />
        <label htmlFor="">Email:</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />

        <label htmlFor="">Profile Picture</label>
          <input 
          type="file" 
          name="img"
          onChange={handleChange}
          />
          
        <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Morocco"
            value={formData.country}
            onChange={handleChange}
          />
        <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+212 666666666"
            value={formData.phone}
            onChange={handleChange}
          />

        <label htmlFor="">Description</label>
          <textarea
            placeholder="Update description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            value={formData.desc}
            onChange={handleChange}
          ></textarea>
        <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default ModifyInformation;
