import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";


const Orders = () => {
  console.log(localStorage.getItem("currentUser"));

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  console.log("currentUser", currentUser)

  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders/${currentUser._id}`).then((res) => {
        console.log("Response:", res.data); // Add this line
        return res.data;
      }),
  });
  
  console.log("isLoading:", isLoading); // Add this line
  console.log("error:", error); // Add this line
  console.log("data:", data); // Add this line
  

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
      window.scrollTo(0, 0);

    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
        window.scrollTo(0, 0);

      }
    }
  };
  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Contact</th>
            </tr>
            {data.map((order) => (
              <tr key={order._id}>
                <td>
                  <img className="image" src={order.img} alt="" />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img
                    className="message"
                    src="./img/message.png"
                    alt=""
                    onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
              
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
