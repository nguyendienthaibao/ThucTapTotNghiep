import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RecruitmentTable from "./RecruitmentTable";
import { AuthContext } from "../../../Context/AuthContext";
import AdminService from "../../../Services/AdminService";
import "./index.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Recruitment(props) {
  const [recruitmentTrue, setrecruitmentTrue] = useState([]);

  const defaultPage = parseInt(props.match.params.page);
  const [page, setpage] = useState(defaultPage);
  const [pageNumber, setpageNumber] = useState("");
  const [totalRecruitmentTrue, settotalRecruitmentTrue] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    AdminService.loadRecruitmentTrue(page).then((data) => {
      if (data.success) {
        setrecruitmentTrue(data.rcm);
        settotalRecruitmentTrue(data.totalRecruitmentTrue);
      }
    });
  }, [page]);

  const newRecruitmentTrue = [...recruitmentTrue];

  const updateStatusRcm = (id, status) => {
    const variable = {
      _id: id,
      statusRcm: !status,
    };
    AdminService.updateStatusRcm(variable).then((data) => {
      const { message } = data;
      if (data.success) {
        AdminService.loadRecruitmentTrue(page).then((data) => {
          if (data.success) {
            setrecruitmentTrue(data.rcm);
            settotalRecruitmentTrue(data.totalRecruitmentTrue);
          }
        });
        return toast.success("Thành công!!!", {
          autoClose: 3000,
        });
      } else {
        return toast.error(`${message.msgBody}`, {
          autoClose: 3000,
        });
      }
    });
  };

  const renderRecruitmentTrue = newRecruitmentTrue.map((rcm, index) => (
    <RecruitmentTable
      updateStatusRcm={updateStatusRcm}
      recruitmentTrue={rcm}
      index={index}
      key={index}
    />
  ));

  const totalPage = Math.ceil(totalRecruitmentTrue / 2);

  const btnPreviousPage = (e) => {
    e.preventDefault();
    setpage(page - 1);
    props.history.push(`/admin/recruitment/${user._id}&page=${page - 1}&true`);
  };

  const btnNextPage = (e) => {
    e.preventDefault();
    setpage(page + 1);
    props.history.push(`/admin/recruitment/${user._id}&page=${page + 1}&true`);
  };

  const handlePage = (e) => {
    e.preventDefault();
    setpageNumber(e.target.value);
  };

  const onGoPage = (e) => {
    e.preventDefault();
    if (pageNumber) {
      if (pageNumber > 0) {
        if (pageNumber <= totalPage) {
          const page = parseInt(pageNumber);
          setpage(page);
          props.history.push(
            `/admin/recruitment/${user._id}&page=${page}&true`
          );
          setpageNumber("");
        } else {
          alert("Không Có Trang Này");
        }
      } else {
        alert("Nhập Một Số Lớn 0, Không Âm Và Là Số Chẳn");
      }
    }
  };

  const reloadTable = () => {
    AdminService.loadRecruitmentTrue(page).then((data) => {
      if (data.success) {
        setrecruitmentTrue(data.rcm);
        settotalRecruitmentTrue(data.totalRecruitmentTrue);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Quản Lý Tin Tuyển Dụng</title>
      </Helmet>
      <ToastContainer />
      <section
        className="page-section my-3 search"
        style={{ minHeight: "450px" }}
      >
        <div className="container no-select">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Tin Tuyển Dụng Đã Duyệt
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row mb-4">
            <div className="col-1">
              <div className="dropdown">
                <a
                  className="btn btn-secondary dropdown-toggle"
                  href="/#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Thay Đổi
                </a>

                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <Link
                    className="dropdown-item"
                    to={`/admin/recruitment/${user._id}&page=1&false`}
                  >
                    Chưa Phê Duyệt
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-1">
              <button
                type="button"
                className="btn btn-primary reload-table"
                title="Tải lại"
                onClick={reloadTable}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <form className="form-inline" onSubmit={onGoPage}>
                <div class="input-group">
                  <input
                    name="page"
                    value={pageNumber}
                    onChange={handlePage}
                    onKeyPress={(event) => {
                      return /\d/.test(
                        String.fromCharCode(event.keyCode || event.which)
                      );
                    }}
                    className="form-control mr-sm-2 no-select"
                    type="number"
                    placeholder="Nhập Số Trang"
                    style={{ borderRadius: "0" }}
                  />
                  <div class="input-group-append">
                    <button
                      className="btn btn-outline-success my-2 my-sm-0"
                      style={{ borderRadius: "0" }}
                      type="submit"
                    >
                      Đi Đến
                    </button>
                  </div>
                </div>
              </form>
              <div className="col d-flex justify-content-end mx-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "0" }}
                  disabled
                >
                  {`Trang: ${
                    totalRecruitmentTrue === 0 ? 0 : page
                  }/${totalPage}`}
                </button>
              </div>
              <table className="table table-striped table-dark ">
                <thead>
                  <tr className="no-select text-center">
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu Đề</th>
                    <th scope="col">Tài Khoản</th>
                    <th scope="col">Ngày Tạo</th>
                    <th scope="col">Hành Động</th>
                    <th scope="col">Trạng Thái</th>
                  </tr>
                </thead>
                {recruitmentTrue.length >= 1 ? null : (
                  <thead>
                    <tr className="no-select text-center">
                      <th scope="col" colSpan="6">
                        <img
                          style={{ maxHeight: "145px" }}
                          alt="empty"
                          src={"assets/img/inbox.svg"}
                        />
                        <h6>
                          <i>(Không có tin nào đã phê duyệt)</i>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                )}
                {renderRecruitmentTrue}
              </table>
            </div>
          </div>
          <div className="row no-select">
            <div className="col d-flex justify-content-end">
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnPreviousPage}
                disabled={true ? page <= 1 : false}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnNextPage}
                disabled={true ? page >= totalPage : false}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Recruitment;
