import React, { useEffect, useContext, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthContext } from "../../Context/AuthContext";
import RecruimentService from "../../Services/RecruimentService";
import CVNoiBatItem from "./CVNoiBatItem";
import "./index.css";

function CVNoiBat() {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 2000,
    });
  }, []);

  const [recruitments, setRecruitments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    RecruimentService.loadRecruitmentFavourite().then((data) => {
      setRecruitments(data.rcm);
    });
  }, []);

  const renderListCV = recruitments.map((recruitment, index) => (
    <CVNoiBatItem
      user={user}
      recruitment={recruitment}
      key={index}
      index={index}
    />
  ));

  return (
    <section className="page-section section-featured" id="portfolio">
      <div className="container" data-aos="flip-left">
        {/* TITLE */}
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0 no-select">
          công việc nổi bật
        </h2>

        {/* DIVIDER */}
        <div className="divider-custom">
          <div className="divider-custom-line" />
          <div className="divider-custom-icon">
            <i className="fas fa-star" />
          </div>
          <div className="divider-custom-line" />
        </div>

        {/* EMPTY STATE */}
        {recruitments.length < 1 ? (
          <div className="text-center py-5">
            <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
            <h5 className="font-weight-bold text-dark">
              Chưa có công việc nổi bật
            </h5>
            <p className="text-muted mb-0">
              Các vị trí tuyển dụng sẽ được cập nhật trong thời gian sớm nhất
            </p>
          </div>
        ) : (
          <div className="row">{renderListCV}</div>
        )}
      </div>
    </section>
  );
}

export default CVNoiBat;
