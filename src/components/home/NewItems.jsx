import React, { useState, useEffect } from "react";
import axios from "axios";
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import Items from "../Items";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1200px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(max-width: 760px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(max-width: 560px)": {
        slides: { perView: 1, spacing: 10 },
      },
    },
  });

  async function getItems() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems");
      setItems(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [items, loading, instanceRef]);
  

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
                  new Array(4).fill(0).map((items, index) => (
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
                  )
                ) : (
          items.map((item) => (
            <div className="keen-slider__slide" key={item.id}>
            <Items item={item} />
            </div>
            
          ))
        )}
      
                  
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
