const express = require("express");
const accRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const JWT = require("jsonwebtoken");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const nodemailer = require("nodemailer");

//gửi mail để xác thực
accRouter.post("/sendMail", async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // 1️⃣ Validate role
    if (role === "admin" || role === "spadmin") {
      return res.status(400).json({
        message: {
          msgBody: "Không có loại tài khoản này",
          msgError: true,
        },
      });
    }

    // 2️⃣ Check tồn tại user
    const user = await Account.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.status(409).json({
        message: {
          msgBody:
            user.username === username
              ? "Tên đăng nhập đã tồn tại"
              : "Email đã tồn tại",
          msgError: true,
        },
      });
    }

    // 3️⃣ Tạo transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS, // App Password
      },
    });

    // 4️⃣ Tạo token
    const token = JWT.sign(
      { username, email, role },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    // 5️⃣ Nội dung mail
    const mailOptions = {
      from: `"IT Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "Kích hoạt tài khoản",
      html: `
        <h1>Vui Lòng Sử Dụng Đường Link Phía Dưới Để Kích Hoạt Tài Khoản</h1>
        <p>Link: <a href="${process.env.CLIENT_URL_LOCAL}/activate/${token}&150999">Click Vào Đây!!!</a></p>
        <h3 style="color:red;">Lưu ý: Đường Link Này Chỉ Có Thời Hạn Là 10 Phút Sau Thời Hạn Sẽ Không Còn Hiệu Lực Nũa!!!</h3>
        <hr />
        <p>Xin gửi lời cảm ơn đến bạn!!!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: {
        msgBody: "Đăng ký thành công",
        msgError: false,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: {
        msgBody: "Lỗi server",
        msgError: true,
      },
    });
  }
});

// Đăng ký cần xác thực email
accRouter.post("/register", async (req, res) => {
  try {
    const { token, password, confirmPass } = req.body;

    // 1️⃣ Validate input
    if (!token || !password || !confirmPass) {
      return res.status(400).json({
        success: false,
        message: {
          msgBody: "Vui lòng nhập đầy đủ thông tin",
          msgError: true,
        },
      });
    }

    if (password !== confirmPass) {
      return res.status(400).json({
        success: false,
        message: {
          msgBody: "Mật khẩu không khớp",
          msgError: true,
        },
      });
    }

    // 2️⃣ Verify token
    const decoded = JWT.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);

    const { username, email, role } = decoded;

    // 3️⃣ Check tồn tại account
    const exists = await Account.findOne({
      $or: [{ username }, { email }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: {
          msgBody: "Tài khoản đã tồn tại",
          msgError: true,
        },
      });
    }

    // 4️⃣ Tạo account
    const newAccount = new Account({
      username,
      email,
      role,
      password,
    });

    await newAccount.save();

    return res.status(201).json({
      success: true,
      message: {
        msgBody: "Tạo tài khoản thành công",
        msgError: false,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: {
        msgBody: "Token không hợp lệ hoặc đã hết hạn",
        msgError: true,
      },
      error,
    });
  }
});

// Đăng ký không cần xác thực Email
// accRouter.post("/register", (req, res) => {
//   const { email, username, password, role } = req.body;
//   Account.findOne(
//     { $or: [{ username: username }, { email: email }] },
//     (err, user) => {
//       if (err)
//         res.status(500).json({
//           message: {
//             msgBody: "Có lỗi khi tìm kiếm với CSDL 1",
//             msgError: true,
//           },
//         });
//       else if (user) {
//         res.status(201).json({
//           message: {
//             msgBody: "Tên đăng nhập hoặc email đã tồn tại",
//             msgError: true,
//           },
//         });
//       } else if (role === "spadmin" || role === "admin") {
//         res.status(201).json({
//           message: {
//             msgBody: "Không có loại tài khoản này",
//             msgError: true,
//           },
//         });
//       } else {
//         const newAccount = new Account({ email, username, password, role });
//         newAccount.save((err) => {
//           if (err)
//             res.status(500).json({
//               message: {
//                 msgBody: "Có lỗi khi thêm tài khoản vào CSDL 2",
//                 msgError: true,
//                 err,
//               },
//             });
//           else
//             res.status(200).json({
//               message: {
//                 msgBody: "Tạo tài khoản thành công",
//                 msgError: false,
//               },
//             });
//         });
//       }
//     }
//   );
// });

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "TTTN",
      sub: userID,
    },
    "TTTN",
    { expiresIn: "1d" }
  );
};

accRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role, status } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { _id, username, role, status } });
    }
  }
);

accRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

accRouter.post(
  "/changePass",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { old_Password, password, configPassword } = req.body;
    const { username, email } = req.user;
    Account.findOne(
      { $or: [{ username: username }, { email: email }] },
      (err, user) => {
        if (err || !user) {
          return res.status(500).json({
            message: {
              msgBody: "Lỗi hoặc tài khoản không tồn tại",
              msgError: true,
            },
            err,
          });
        }
        if (password !== configPassword) {
          return res.status(400).json({
            message: {
              msgBody: "Mật khẩu xác nhận không đúng",
              msgError: true,
            },
          });
        }
        bcrypt.compare(
          old_Password,
          req.user.password,
          function (err, isMatch) {
            console.log(err);
          }
        );
        bcrypt.compare(
          old_Password,
          req.user.password,
          function (err, isMatch) {
            if (err) {
              res.status(400).json({
                message: {
                  msgBody: "Có Lỗi!!!",
                  msgError: true,
                },
                err,
              });
            }
            if (!isMatch) {
              res.status(400).json({
                isMatch: isMatch,
                message: {
                  msgBody: "Mật khẩu cũ không đúng",
                  msgError: true,
                },
              });
            } else {
              const updatePassword = {
                password: password,
              };
              user = lodash.extend(user, updatePassword);
              user.save((err, result) => {
                if (err) {
                  return res.status(500).json({
                    message: {
                      msgBody: "Lỗi thêm không thành công",
                      msgError: true,
                    },
                    err,
                  });
                }
                res.status(200).json({
                  message: {
                    msgBody: "Thay Đổi Mật Khẩu Thành Công",
                    msgError: false,
                  },
                });
              });
            }
          }
        );
      }
    );
  }
);

accRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, username, role, status } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: {
        _id,
        username,
        role,
        status,
      },
    });
  }
);

module.exports = accRouter;
