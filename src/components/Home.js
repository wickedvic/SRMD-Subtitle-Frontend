import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <>
      <div
        id="myCarousel"
        class="carousel carousel-fade slide"
        data-ride="carousel"
        data-interval="3000"
      >
        <div class="carousel-inner" role="listbox">
          <div
            class="item active background a"
            style={{ height: "93vh" }}
          ></div>
        </div>
      </div>

      <div class="covertext">
        <div class="col-lg-10" style={{ float: "none", margin: "0 auto" }}>
          <h1 class="title">SRMD Subtitle Editor</h1>
          <h3 class="subtitle">
            A Tidy, Clean, Easy-to-Use, and Responsive subtitle editor
            application
          </h3>
        </div>
        <div class="col-xs-12 explore">
          <a href="/videos">
            <button
              type="button"
              class="btn btn-lg explorebtn"
              style={{ cursor: "pointer" }}
            >
              EXPLORE
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
