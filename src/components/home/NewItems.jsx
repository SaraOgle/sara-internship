import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const NewItems = () => {
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
      const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems");
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

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [users, loading, instanceRef]);
    
  const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const time = expiryDate - Date.now();
      
      if (time <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();

    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return <>{timeLeft}</>;
};

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="navigation-wrapper" style={{ position: 'relative' }}>
            <div ref={sliderRef} className="keen-slider">
          {loading
                ?
                  new Array(4).fill(0).map((_, index) => (
                    <div className="keen-slider__slide" key={index}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                        </div>
                        <div className="nft__item_wrap">
                          <div className="skeleton-box" style={{ width: '100%', height: '250px' }}></div>
                        </div>
                        <div className="nft__item_info">
                          <div className="skeleton-box" style={{ width: '100px', height: '20px' }}></div>
                          <div className="skeleton-box" style={{ width: '60px', height: '20px' }}></div>
                        </div>
                      </div>
                    </div>
                  ))
                :
                users.map((user) => (
            <div className="keen-slider__slide" key={user.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={user.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="de_countdown">
                  {user.expiryDate ? (
                    <Countdown expiryDate={user.expiryDate} />
                  ) : (
                    "EXPIRED"
                    )}
                    </div>
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to="/item-details">
                    <img
                      src={user.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{user.title}</h4>
                  </Link>
                  <div className="nft__item_price">{user.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{user.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
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
      </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
