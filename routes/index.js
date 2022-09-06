const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { createHash } = require('crypto');

router.get('/', (req, res) => {
    res.render('form', { title: '' });
  });

router.get('/askacoach', (req, res) => {
    res.render('askacoach', { title: '' });
  });

  router.post('/',
  [
    check('answer')
      .isLength({ min: 1 })
      .withMessage('No answer entered!'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        let hash = createHash('sha256').update(req.body.answer.toLowerCase()).digest('hex');
     if(hash === "1c48f6310f1c849b4ac338d340ee667bf3b6d59b589348eaa2b8a0698ff73481") {
        res.render('images');
     } else {
        res.render('form', {
            title: '',
            errors: errors.array(),
          });
     }  
    } else {
      res.render('form', {
        title: '',
        errors: errors.array(),
        data: req.body,
      });
    }
  });

module.exports = router;