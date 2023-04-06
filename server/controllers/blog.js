const slugify = require("slugify");
const formidable = require("formidable");
var striptags = require("striptags");
const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const fs = require("fs");
const _ = require('lodash');
const { smartTrim } = require("../helpers/blog");

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image Could not upload" });
    }
    const { title, body, categories, tags, postedBy } = fields;

    if (!title || !title.length) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!body || body.length < 200) {
      return res.status(500).json({ error: "Content is too short" });
    }
    if (!categories || categories.length === 0) {
      return res
        .status(500)
        .json({ error: "At least one category is required" });
    }
    if (!tags || tags.length === 0) {
      return res.status(500).json({ error: "At least one tag is required" });
    }

    const blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = striptags(body.substring(0, 160));
    blog.postedBy = postedBy;
    // categories and tags
    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1mb size" });
      }
    }
    blog.photo.data = fs.readFileSync(files.photo.filepath);
    blog.photo.contentType = files.photo.type;

    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({ err });
        } else {
          Blog.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({ err });
            } else {
              return res.status(200).json(result);
            }
          });
        }
      });
    });
  });
};

exports.list = (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    // .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json( {err });
            }
      return res.json(data);
    });
};


exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                 return res.status(500).json( {err });
            }
            blogs = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                  return res.status(500).json( {err });
                }
                categories = c; // categories
                // get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                      return res.status(500).json( {err });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });
            });
        });
};


exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .populate('categories', '_id name slug')
        .populate('postedBy', '_id name profile')
        .populate('tags', '_id name slug')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
          console.log(err);
            if (err) {
                 return res.status(500).json( {err });
            }
            console.log({data});
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
          return res.status(500).json( {err });
        }
        res.json({
            message: 'Blog deleted successfully'
        });
    });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
          return res.status(500).json( {err });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
          }

            let slugBeforeMerge = oldBlog.slug;
          oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

          if (body) {
            oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                // oldBlog.desc = stripHtml(body.substring(0, 160));
            }

          if (categories) {
                oldBlog.categories = categories.split(',');
            }

          if (tags) {
                oldBlog.tags = tags.split(',');
            }

          if (files.photo) {
            console.log("File ",files.photo.size);
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
            oldBlog.photo.contentType = files.photo.type;
            console.log(oldBlog.photo.contentType);
            }

          oldBlog.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: err
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
              return res.status(500).json( {err });
            }
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;
  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs) => {
        if (err) {
            return res.status(400).json({
                error: 'Blogs not found'
            });
          }
          res.status(200).json(blogs);
    });
}