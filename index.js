import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let posts = []; // in-memory storage

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes

// Home - show posts + new post form
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Add new post
app.post('/new', (req, res) => {
  const { name, title, content } = req.body;
  const createdAt = new Date().toLocaleString();
  posts.push({ name, title, content, createdAt });
  res.redirect('/');
});

// Delete post
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  posts.splice(id, 1); // remove the post
  res.redirect('/');
});

// Show edit form
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const post = posts[id];
  if (!post) return res.redirect('/');
  res.render('index', { posts, editId: id, editPost: post });
});

// Update post
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { name, title, content } = req.body;

  // Keep original timestamp
  const createdAt = posts[id].createdAt;

  // Update post in memory
  posts[id] = { name, title, content, createdAt };

  res.redirect('/');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
