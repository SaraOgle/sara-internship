import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const HotCollections = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1000px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(max-width: 500px)": {
        slides: { perView: 1, spacing: 10 },
      },
    },
  });

  async function getUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections");
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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="navigation-wrapper" style={{ position: 'relative' }}>
            <div ref={sliderRef} className="keen-slider">
              {loading
                ? 
                  new Array(6).fill(0).map((_, index) => (
                    <div className="keen-slider__slide" key={index}>
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <div 
                            className="skeleton-box" 
                            style={{ width: "100%", height: "200px", borderRadius: "8px" }}
                          ></div>
                        </div>
                        <div className="nft_coll_pp">
                          <div 
                            className="skeleton-box" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                          ></div>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <div 
                            className="skeleton-box" 
                            style={{ width: "100px", height: "20px", marginBottom: "5px" }}
                          ></div>
                          <br />
                          <div 
                            className="skeleton-box" 
                            style={{ width: "60px", height: "15px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                : 
                  users.map((user, index) => (
                    <div className="keen-slider__slide" key={index}>
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to="/item-details/${user.nftId}`}">
                            <img src={user.nftImage} className="lazy img-fluid" alt="" />
                          </Link>
                        </div>
                        <div className="nft_coll_pp">
                          <Link to="/author">
                            <img className="lazy pp-coll" src={user.authorImage} alt="" />
                          </Link>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <Link to="/explore">
                            <h4>{user.title}</h4>
                          </Link>
                          <span>ERC-{user.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && (
              <>
                <button 
                  className="arrow arrow--left" 
                  onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button 
                  className="arrow arrow--right" 
                  onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;