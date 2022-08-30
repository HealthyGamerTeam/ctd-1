const express = require('express');
const router = express.Router();
require('dotenv').config()
const { check, validationResult } = require('express-validator');
const { createHash } = require('crypto');
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database(process.env.DB_PATH, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {

  db.run ('CREATE TABLE IF NOT EXISTS IPTABLE ( IP NUMBER NOT NULL UNIQUE )', (err) => {
    if(err) return;
  });

  if(err) {
      return console.error("Error connecting to DB: " + err.message);
  }
});

router.get('/', (req, res) => {
    //Check if IP has submitted an answer before
      db.all(`SELECT IP FROM IPTABLE WHERE IP = "${req.ip}"`, (err, rows) => {
      if(err) console.log(err);

      if (rows.length === 0) {
        res.render('form', { title: '' });
      } else {
        rows.forEach((row) => {
          res.render('form2', { title: '' });
        }); 
      }
    });
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
      //Check if IP has submitted an answer before
      db.all(`SELECT IP FROM IPTABLE WHERE IP = "${req.ip}"`, (err, rows) => {
        if(err) console.log(err);
  
        if (rows.length === 0) {
          
          let hash = createHash('sha256').update(req.body.answer.toLowerCase()).digest('hex');
          if(hash === "1c48f6310f1c849b4ac338d340ee667bf3b6d59b589348eaa2b8a0698ff73481") {
              res.render('images');
          } else {
              db.all(`INSERT INTO IPTABLE (IP) VALUES ("${req.ip}")`, (err, rows) => {
                if(err) console.log(err);
              });

              res.render('form2', {
                  title: '',
                  errors: errors.array(),
                });
          }  
        } else {
          rows.forEach((row) => {
            res.render('form2', {
              title: '',
              errors: errors.array(),
            });
          }); 
        }
      });
    } else {
      res.render('form', {
        title: '',
        errors: errors.array(),
        data: req.body,
      });
    }
  });

module.exports = router;