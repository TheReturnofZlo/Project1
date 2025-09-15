import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let posts = []; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');



// Home page where you can see posts or create one
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
  posts.splice(id, 1); 
  res.redirect('/');
});

// Show edit form
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const post = posts[id];
  if (!post) return res.redirect('/');
  res.render('index', { posts, editId: id, editPost: post });
});

// Edit post
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { name, title, content } = req.body;

  // Timestamp
  const createdAt = posts[id].createdAt;

  // Update post in memory
  posts[id] = { name, title, content, createdAt };

  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

