import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Items from '../Items'

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [visibleCount, setVisibleCount] = useState(8);
  const [filter, setFilter] = useState("");

  async function getItems(filterValue) {
    setLoading(true);
    try {
      const url = filterValue 
        ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${filterValue}`
        : `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`;
      
      const { data } = await axios.get(url);
      setItems(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    getItems(filter);
  }, [filter]);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };
  

  return (
    <>
      <div>
        <select id="filter-items" 
        defaultValue=""
        onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      
      <div className="row">
        
        {loading
              ?
                new Array(8).fill(0).map((_, index) => (
                  <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" style={{ display: "block", backgroundSize: "cover" }} >
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
                  </div>
                  )
                ) : (
          items.slice(0, visibleCount).map((item) => (
            <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" style={{ display: "block", backgroundSize: "cover" }} >
            <Items item={item} key={item.id} />
            </div>
          ))
        )}
      </div>
      

      {visibleCount < items.length && (
      <div className="col-md-12 text-center">
        <button onClick={loadMore} id="loadmore" className="btn-main lead" style={{ border: 'none', cursor: 'pointer' }}>
          Load more
        </button>
      </div>
      )}
    </>
  );
};

export default ExploreItems;
