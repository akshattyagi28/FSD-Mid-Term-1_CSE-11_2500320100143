const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookController");

router.post("/", controller.addBook);
router.get("/", controller.getAllBooks);

router.get("/search", controller.searchBooks);

router.get("/:id", controller.getBookById);
router.put("/:id", controller.updateBook);
router.delete("/:id", controller.deleteBook);

router.post("/:id/issue", controller.issueBook);
router.post("/:id/return", controller.returnBook);

module.exports = router;
