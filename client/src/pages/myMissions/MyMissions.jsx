import React from "react";
import { Link } from "react-router-dom";
import "./MyMissions.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyMissions() {
  const currentUser = getCurrentUser();

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myMissions"],
    queryFn: () =>
    newRequest.get(`/missions?userId=${currentUser._id}`).then((res) => {
      return res.data;

    }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/missions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myMissions"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };
console.log("Missions Data:", data);
  return (
    <div className="myMissions">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Missions</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Mission</button>
              </Link>
            )}
          </div>
          <table>
            <tbody>
             <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Views</th>
              <th>Action</th>
             </tr>
            {data.map((mission) => (
              <tr key={mission._id}>
                <td>
                  <img className="image" src={mission.cover} alt="" />
                  
                </td>
                <td>{mission.title}</td>
                <td>{mission.price}</td>
                <td>{mission.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(mission._id)}
                  />
              
                  <img
                    className="edit"
                    src="./img/edit.png"
                    alt=""
                    onClick={() => handleEdit(mission._id)}
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
}

export default MyMissions;
