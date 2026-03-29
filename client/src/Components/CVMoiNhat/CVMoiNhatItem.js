import React from "react";
import "./index.css";
import moment from "moment";
import "moment/locale/vi";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { Link } from "react-router-dom";

function CVMoiNhatItem({ recruitment, user }) {
  if (!recruitment) return null;

  let luong = recruitment.salary;
  const dateCre = moment(recruitment.createdAt).format("DD/MM/YYYY HH:mm:ss");

  luong = luong?.toLocaleString("it-IT");

  const images =
    recruitment.img && recruitment.img.length > 0
      ? recruitment.img.map((img) => ({
          original: img,
          thumbnail: img,
        }))
      : [
          {
            original: "assets/img/default-job.png",
            thumbnail: "assets/img/default-job.png",
          },
        ];

  const isOwner =
    user &&
    (user.role === "admin" ||
      user.role === "spadmin" ||
      user._id === recruitment.writer);

  return (
    <div className="col-md-6 col-lg-4 mb-5 cv-item">
      <div className="card card-MN w-100 h-100">
        {/* MENU ADMIN */}
        {isOwner && (
          <div className="dropdown menu-recruitment">
            <i
              className="fas fa-bars"
              id="dropdownMenu2"
              data-toggle="dropdown"
            ></i>
            <div className="dropdown-menu">
              <Link
                to={`/updateRecruitment/${recruitment._id}`}
                className="dropdown-item"
              >
                Cập nhật
              </Link>
            </div>
          </div>
        )}

        {/* IMAGE */}
        <div className="p-2 img" style={{ height: "150px" }}>
          <ImageGallery
            items={images}
            autoPlay
            showNav={false}
            showThumbnails={false}
            showPlayButton={false}
            showFullscreenButton={false}
          />
        </div>

        {/* CONTENT */}
        <div className="card-body mt-2">
          <h5 className="card-title cvMN-item-sumary">
            <Link
              to={`/recruitment/${recruitment._id}`}
              className="cv-title text-primary"
            >
              {recruitment.title}
            </Link>
          </h5>

          <p className="card-text cvMN-salary">
            <span>
              <i className="fas fa-money-bill-wave px-1"></i>
              {luong} VNĐ
            </span>
            <span className="mx-2"></span>
            <span>
              <i className="fas fa-map-marker-alt px-1"></i>
              <Link to="/">{recruitment.city?.name}</Link>
            </span>
            <br />
            <span>
              <i className="fas fa-clock px-1"></i>
              <i>{dateCre}</i>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CVMoiNhatItem;
