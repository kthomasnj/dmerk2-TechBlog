// const router = require("express").Router();
// const { Post, User, Comment } = require("../models");

// // get all posts for homepage
// router.get("/", (req, res) => {
//   Post.findAll({
//     attributes: ["id", "post_text", "title"],
//     include: [
//       {
//         model: Comment,
//         attributes: ["id", "comment_text", "post_id", "user_id"],
//         include: {
//           model: User,
//           attributes: ["username"],
//         },
//       },
//       {
//         model: User,
//         attributes: ["username"],
//       },
//     ],
//   })
//     .then((dbPostData) => {
//       // serialize data before passing to template
//       const posts = dbPostData.map((post) => post.get({ plain: true }));
//       res.render("homepage", {
//         posts,
//         loggedIn: req.session.loggedIn,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // get one post
// router.get("/post/:id", (req, res) => {
//   Post.findOne({
//     where: {
//       id: req.params.id,
//     },
//     attributes: ["id", "post_text", "title"],
//     include: [
//       {
//         model: Comment,
//         attributes: ["id", "comment_text", "post_id", "user_id"],
//         include: {
//           model: User,
//           attributes: ["username"],
//         },
//       },
//       {
//         model: User,
//         attributes: ["username"],
//       },
//     ],
//   })
//     .then((dbPostData) => {
//       if (!dbPostData) {
//         res.status(404).json({ message: "No post found with this id" });
//         return;
//       }
//       const post = dbPostData.get({ plain: true });
//       res.render("single-post", { post, loggedIn: req.session.loggedIn });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.get("/login", (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect("/");
//   }

//   res.render("login");
// });

// router.get("/signup", (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect("/");
//   }

//   res.render("signup");
// });

// module.exports = router;
const router = require("express").Router();
const { User } = require("../models");
const withAuth = require("../utils/auth");

// Using the withAuth function created in the utils folder
router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["name", "ASC"]],
    });

    console.log(userData);

    const users = userData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      users,
      // When rendering the homepage, the user is logged in and the session data begins
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// If the users session is still logged in, redirect them to the homepage
router.get("/login", (req, res) => {
  console.log(req);
  console.log(req.session);

  if (req.session.logged_in) {
    res.redirect("/");
    // return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("login");
});

module.exports = router;
