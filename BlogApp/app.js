let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require('mongoose'),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer")

//APP Config
mongoose.connect('mongodb://localhost/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
// app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//Blog Schema
const blog_app = new mongoose.Schema({
  title: String,
  img: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const blogs = mongoose.model('blogs', blog_app);


//RESTful routing

//redirecting to index
app.get("/", (req, res) => {
  res.redirect("/blogs")
})

//index route
app.get("/blogs", (req, res) => {
  blogs.find({}, (err, blogs) => {
    if (err) {
      console.log("error occured")
    } else {
      res.render('index', {
        blogs: blogs
      })
    }
  })
})

//post request to index
app.post("/blogs", (req, res) => {
  req.body.blog.description=req.sanitize(req.body.blog.description) //to sanitize the input if the user enters some script tag and all
  if (req.body.blog.title == " " && req.body.blog.desc == " ") {
    res.redirect("/blogs/new")
  } else {
    blogs.create(req.body.blog, (err, blogs) => {
      if (err) {
        console.log(err)
      } else {
        res.redirect("/blogs")
      }
    })
  }

})

//new route
app.get("/blogs/new", (req, res) => {
  res.render("new")
})

//blog/id route
app.get("/blogs/:id", (req, res) => {
  let id = req.params.id;
  blogs.findById({
    _id: id
  }, (err, blog) => {
    if (err) {
      console.log("error")
    } else {
      res.render("show", {
        blog: blog
      })
    }
  })
})



//blog/id/edit route
app.get("/blogs/:id/edit", (req, res) => {
  let id = req.params.id;
  blogs.findById({
    _id: id
  }, (err, blog) => {
    if (err) {
      console.log("error")
    } else {
      res.render("edit", {
        blog: blog
      })
    }
  })
});
//blog/:id update route
app.put("/blogs/:id", (req, res) => {
  req.body.blog.description=req.sanitize(req.body.blog.description)
  blogs.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs/" + req.params.id)
    }
  })

});

// blog/id delete route
app.delete("/blogs/:id", (req, res) => {
  blogs.findByIdAndDelete(
    req.params.id, (err, blog) => {
      if (err) {
        res.redirect("/blogs")
      } else {
        res.redirect("/blogs")
      }
    })

})
app.listen(3000, () => {
  console.log("Starting app at PORT:3000")
});