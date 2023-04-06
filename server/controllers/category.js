const Category = require('../models/category');
const slugify = require('slugify');
const blog = require('../models/blog');
// const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let category = new Category({ name, slug });

    category.save((err, data) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json(err)
            // return res.status(400).json({
            //     error: errorHandler(err)
            // });
        }
        return res.status(200).json(data);
    });
};

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(200).json(err)

            // return res.status(400).json({
            //     error: errorHandler(err)
            // });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(200).json(err)
            // return res.status(400).json({
            //     error: errorHandler(err)
            // });
        }
        // res.json(category);
        blog.find({ categories: category })
        .populate('categories', '_id name slug')
        .populate('postedBy', '_id name')
            .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({ category: category, blogs: data });
            });
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(200).json(err)
            
            // return res.status(400).json({
            //     error: errorHandler(err)
            // });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });
};
