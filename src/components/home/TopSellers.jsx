import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopSellers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 

  async function getUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false); 
    }
  }
  useEffect(() => {
    getUsers();
  }, []);


  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ?
                  new Array(6).fill(0).map((_, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <div
                          className="skeleton-box"
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        ></div>
                      </div>
                      <div className="author_list_info">
                        <div
                          className="skeleton-box"
                          style={{ width: "100px", height: "20px" }}
                        ></div>
                        <div
                          className="skeleton-box"
                          style={{ width: "60px", height: "15px" }}
                        ></div>
                      </div>
                    </li>
                  ))
                :
                users.map((users) => (
                <li key={users.id}>
                  <div className="author_list_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-author"
                        src={users.authorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to="/author/${user.authorId}">{users.authorName}</Link>
                    <span>{users.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
