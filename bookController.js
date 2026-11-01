const books = require("../data/books");
const validateBook = require("../middleware/validateBook");

const findBook = (id) => books.find((b) => String(b.id) === String(id));

exports.addBook = (req, res) => {
  const errors = validateBook(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { id, title, author, category, quantity } = req.body;

  if (findBook(id)) {
    return res
      .status(409)
      .json({ success: false, message: "Book with this ID already exists" });
  }

  const book = { id, title, author, category, quantity, available: quantity };
  books.push(book);

  res.status(201).json({ success: true, message: "Book added successfully", data: book });
};

exports.getAllBooks = (req, res) => {
  if (books.length === 0) {
    return res
      .status(200)
      .json({ success: true, message: "No books available", count: 0, data: [] });
  }
  res.status(200).json({ success: true, count: books.length, data: books });
};

exports.getBookById = (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  res.status(200).json({ success: true, data: book });
};

exports.searchBooks = (req, res) => {
  const { title, author, category } = req.query;

  if (!title && !author && !category) {
    return res.status(400).json({
      success: false,
      message: "Provide title, author or category to search",
    });
  }

  const match = (field, value) => field.toLowerCase().includes(value.toLowerCase());

  const results = books.filter(
    (b) =>
      (!title || match(b.title, title)) &&
      (!author || match(b.author, author)) &&
      (!category || match(b.category, category))
  );

  res.status(200).json({ success: true, count: results.length, data: results });
};

exports.updateBook = (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (req.body.id !== undefined && String(req.body.id) !== String(book.id)) {
    return res.status(400).json({ success: false, message: "Book ID cannot be changed" });
  }

  const errors = validateBook(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { title, author, category, quantity } = req.body;

  const issued = book.quantity - book.available; 
  if (quantity !== undefined && quantity < issued) {
    return res.status(400).json({
      success: false,
      message: `Quantity cannot be less than currently issued copies (${issued})`,
    });
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (category !== undefined) book.category = category;
  if (quantity !== undefined) {
    book.quantity = quantity;
    book.available = quantity - issued;
  }

  res.status(200).json({ success: true, message: "Book updated successfully", data: book });
};

exports.deleteBook = (req, res) => {
  const index = books.findIndex((b) => String(b.id) === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  const [deleted] = books.splice(index, 1);
  res.status(200).json({ success: true, message: "Book deleted successfully", data: deleted });
};

exports.issueBook = (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  if (book.available <= 0) {
    return res.status(400).json({ success: false, message: "No copies available to issue" });
  }

  book.available -= 1;
  res.status(200).json({ success: true, message: "Book issued successfully", data: book });
};

exports.returnBook = (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  if (book.available >= book.quantity) {
    return res
      .status(400)
      .json({ success: false, message: "All copies are already in the library" });
  }

  book.available += 1;
  res.status(200).json({ success: true, message: "Book returned successfully", data: book });
};
