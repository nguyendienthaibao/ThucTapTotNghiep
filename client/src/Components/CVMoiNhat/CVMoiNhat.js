import React, { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthContext } from "../../Context/AuthContext";
import RecruimentService from "../../Services/RecruimentService";
import CVMoiNhatItem from "./CVMoiNhatItem";
import "./index.css";

function CVMoiNhat() {
  const [recruitments, setRecruitments] = useState([]);
  const { user } = useContext(AuthContext);
  const [skip, setSkip] = useState(0);
  const [totalRcm, setTotalRcm] = useState(0);
  const [animationLoadMore, setAnimationLoadMore] = useState(0);
  const [dem, setdem] = useState(1);

  /* INIT AOS – BẮT BUỘC ĐỂ CÓ HIỆU ỨNG */
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 2000,
      once: true, // quay 1 lần cho mượt
    });
  }, []);

  useEffect(() => {
    getRecruitment({ skip: 0 });
  }, []);

  const getRecruitment = (variable) => {
    RecruimentService.loadRecruitment(variable).then((data) => {
      setRecruitments((prev) => [...prev, ...data.rcm]);
      setTotalRcm(data.total);
    });
  };

  const renderListCV = recruitments.map((recruitment, index) => (
    <CVMoiNhatItem
      user={user}
      recruitment={recruitment}
      key={index}
      index={index}
    />
  ));

  const loadMore = () => {
    const Skip = skip + 3;
    const Dem = dem + 1;
    const variable = { skip: Skip };

    const top = animationLoadMore + 2345;
    window.scrollTo({ top: top, behavior: "smooth" });

    getRecruitment(variable);
    setSkip(Skip);
    setAnimationLoadMore(top);
    setdem(Dem);
  };

  const totalLoadmore = Math.ceil(totalRcm / 3);

  return (
    <section
      className="page-section portfolio bg-new"
      data-aos="flip-left"   /* 👈 HIỆU ỨNG QUAY */
    >
      <div className="container">
        {/* TITLE */}
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0 no-select">
          công việc mới nhất
        </h2>

        {/* DIVIDER */}
        <div className="divider-custom">
          <div className="divider-custom-line"></div>
          <div className="divider-custom-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="divider-custom-line"></div>
        </div>

        {/* EMPTY STATE */}
        {totalRcm === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
            <h5 className="font-weight-bold text-dark">
              Chưa có công việc mới
            </h5>
            <p className="text-muted mb-0">
              Các vị trí tuyển dụng sẽ được cập nhật sớm nhất
            </p>
          </div>
        ) : (
          <div className="row">{renderListCV}</div>
        )}

        {/* LOAD MORE */}
        {totalRcm > 3 && dem !== totalLoadmore && (
          <div className="row mt-4">
            <div className="col mx-auto d-flex justify-content-center">
              <button
                className="btn btn-outline-secondary loadMoreBtn"
                onClick={loadMore}
              >
                Xem thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CVMoiNhat;
