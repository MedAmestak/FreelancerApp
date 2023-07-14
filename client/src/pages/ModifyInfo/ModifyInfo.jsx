import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";



const ModifyInformation = ({ userId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
        setFormData({ username, email, img, country, phone, desc });
      } catch (error) {
        console.log("Error fetching user information:", error);
      }
    };
    
    

    fetchUserInformation();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await newRequest.put(`/users/${userId}`, formData);
      navigate("/"); // Redirect to the homepage or any other desired page after successful update
    } catch (error) {
      console.log("Error updating user information:", error);
    }
  };

  return (
    <div className="modify-information">
      <h1>Modify Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Image:
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
          ></textarea>
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ModifyInformation;
