const express = require('express')
const router = express.Router()

router.get('/controller2', async (req, res, next) => {
  res.render('controller2')
})

router.post('/controller2', async (req, res, next) => {
  await connection.query(
    'UPDATE KART_MATCH SET MAT_ATEAMNAME = ? , MAT_ASCORE = ?, MAT_BTEAMNAME = ?, MAT_BSCORE = ? WHERE MAT_TITLE = ?;',
    [
      req.body.MAT_ATEAMNAME,
      req.body.MAT_ASCORE,
      req.body.MAT_BTEAMNAME,
      req.body.MAT_BSCORE,
      req.body.MAT_TITLE,
    ],
    function (err, result) {
      if (err) {
        console.log(err)
      } else {
        connection.query(
          `SELECT * FROM KART_MATCH WHERE MAT_TITLE = '${req.body.MAT_TITLE}'`,
          function (err, selResults, fields) {
            if (err) {
              console.log(err)
              return
            }
            res.json(selResults)
          }
        )
      }
    }
  )
})
router.get('/controller2/data', async (req, res, next) => {
  if (req.body) {
    await connection.query(
      `SELECT * FROM KART_MATCH WHERE MAT_TITLE = '${req.query.MAT_TITLE}'`,
      function (err, result, fields) {
        if (err) {
          console.log(err)
          return
        }
        res.json(result)
      }
    )
  }
})

module.exports = router
