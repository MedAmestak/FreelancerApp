import React from "react";
import "./Mission.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Mission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["mission"],
    queryFn: () =>
      newRequest.get(`/missions/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });


  const handleContact = async () => {
    console.log('dataUser._id:', dataUser._id); // 

    try {
      // Check if a conversation already exists
      const response = await newRequest.get(`/conversations/single/${dataUser._id}`);
      const conversationId = response.data.id;

      if (conversationId) {
        // Conversation exists, send the message
        await newRequest.post(`/messages`, {
          conversationId,
          desc: "Hello client! This is a message from the freelancer.",
        });
      } else {
        // Conversation doesn't exist, create a new conversation and send the message
        const createConversationResponse = await newRequest.post(`/conversations`, {
          to: dataUser._id,
        });
        const newConversationId = createConversationResponse.data.id;

        await newRequest.post(`/messages`, {
          conversationId: newConversationId,
          desc: "Hello client! This is a message from the freelancer.",
        });
      }

      // Redirect to the message page
      navigate(`/message/${dataUser._id}`);
      window.scrollTo(0, 0);

    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleTestMissionSubmission = async () => {
    //try {
      // Make an API request to submit the gig without payment
      //await newRequest.post(`/submit-mission/${id}`);

      // Redirect the user to the orders tab
      console.log('______')
      navigate('/orders');
      window.scrollTo(0, 0);

//    } catch (error) {
  //    console.log('Error submitting mission:', error);
   // }
  };

  const makeRequest = async () => {
    try {
      await newRequest.post(
        `/orders/submit-mission/${id}`
      );
      navigate("/orders")
      window.scrollTo(0, 0);

      //setClientSecret(res.data.clientSecret);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="mission">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              FreelancerApp {">"} Graphics & Design {">"}
            </span>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => (
                <img key={img} src={img} alt="" />
              ))}
            </Slider>
            <h2>About This Mission</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Client</h2>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <button onClick={handleContact}>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews missionId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>{data.deliveryDate} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link to={`/pay/${id}`}>
              <button>Continue</button>
            </Link>
       
              <button onClick={makeRequest}>Submit the Mission</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Mission;
