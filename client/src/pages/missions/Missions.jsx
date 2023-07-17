import React, { useEffect, useRef, useState } from "react";
import "./Missions.scss";
import MissionCard from "../../components/missionCard/MissionCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Missions() {
  const [sort, setSort] = useState("views");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["missions"],
    queryFn: () =>
      newRequest
        .get(
          `/missions${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="missions">
      <div className="container">
        <span className="breadcrumbs">Web Developement/Graphics & Design and much more</span>
        <h1>Discover Exciting Missions </h1>

        <div className="menu">
          <div className="left">
            <span>Mission Pricing Range</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "views" ? "Best Client" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "views" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("views")}>Best Client</span>
                )}
                <span onClick={() => reSort("views")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((mission) => <MissionCard key={mission._id} item={mission} />)}
        </div>
      </div>
    </div>
  );
}

export default Missions;
