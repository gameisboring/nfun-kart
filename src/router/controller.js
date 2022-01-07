const express = require('express')
const router = express.Router()
var connection = require('../lib/db')

router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM KART', function (err, selResults, fields) {
    if (selResults.length < 1) {
      res.render('controller')
    } else {
      const {
        ATEAMNAME,
        BTEAMNAME,
        ASCORE,
        BSCORE,
        TITLE,
        ATEAMWIN,
        BTEAMWIN,
      } = selResults[0]

      let WHICHTEAMWIN = ''
      if (ATEAMWIN && !BTEAMWIN) {
        WHICHTEAMWIN = 'A팀 승리'
      } else if (!ATEAMWIN && BTEAMWIN) {
        WHICHTEAMWIN = 'B팀 승리'
      } else {
        WHICHTEAMWIN = '데이터 없음'
      }

      res.render('controller', {
        title: TITLE,
        score_a: ASCORE,
        score_b: BSCORE,
        name_a: ATEAMNAME,
        name_b: BTEAMNAME,
        win_check: WHICHTEAMWIN,
      })
    }
  })
})

router.post('/', async (req, res, next) => {
  if (!req.body) {
    return
  }
  await connection.query(
    'SELECT * FROM KART',
    function (err, selResults, fields) {
      // 입력된 데이터 없으면
      if (selResults.length < 1) {
        console.log('New Insert')
        // 데이터 삽입
        connection.query(
          `INSERT INTO KART(ATEAMNAME,BTEAMNAME,ASCORE,BSCORE,TITLE) VALUES('${req.body.aName}','${req.body.bName}',${req.body.aScore} ,${req.body.bScore} ,'${req.body.title}');`,
          function (err, insertResults, fields) {
            if (err) {
              console.log(err)
              return
            } else {
              connection.query(
                'SELECT * FROM KART',
                function (err, _selResults, fields) {
                  res.status(200)
                  _selResults[0].ok = true
                  res.json(_selResults[0])
                }
              )
            }
          }
        )
      } else {
        const updateKartQuery = `UPDATE KART SET ATEAMNAME = '${req.body.aName}' , BTEAMNAME = '${req.body.bName}' , ASCORE = '${req.body.aScore}' , BSCORE = '${req.body.bScore}' , TITLE = '${req.body.title}';`
        connection.query(updateKartQuery, function (err, results, fields) {
          if (err) {
            res.status(500)
            res.json({ ok: false })
            return
          } else {
            connection.query(
              'SELECT * FROM KART',
              function (err, _selResults, fields) {
                res.status(200)
                _selResults[0].ok = true
                res.json(_selResults[0])
              }
            )
          }
        })
      }
    }
  )
})

router.post('/change', async (req, res, next) => {
  const query = `update kart set ateamname = (@name_temp:=ateamname), ateamname = bteamname , bteamname = @name_temp, ascore = (@score_temp:=ascore), ascore = bscore, bscore = @score_temp;`
  await connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err)
    } else {
      connection.query(
        'SELECT * FROM KART',
        function (err, _selResults, fields) {
          _selResults[0].ok = true
          res.json(_selResults[0])
        }
      )
    }
  })
})

router.post('/clear', async (req, res, next) => {
  await connection.query(
    'UPDATE KART SET ASCORE = 0 , BSCORE = 0;',
    function (err, results, fields) {
      if (err) {
        console.log(err)
      }
    }
  )
  await connection.query(
    'UPDATE KART_RESULT SET RES_ASCORE = 0 , RES_BSCORE = 0;',
    function (err, results, fields) {
      if (err) {
        console.log(err)
      }
    }
  )

  await connection.query(
    'SELECT * FROM KART',
    function (err, _selResults, fields) {
      _selResults[0].ok = true
      res.json(_selResults[0])
    }
  )
})
router.post('/data', async (req, res, next) => {
  connection.query(
    'SELECT ATEAMWIN,BTEAMWIN FROM KART;',
    function (err, result) {
      res.json(result)
    }
  )
})
router.get('/result', async (req, res, next) => {
  connection.query('SELECT * FROM KART_RESULT;', function (err, result) {
    res.json(result)
  })
})
router.post('/result', async (req, res, next) => {
  connection.query(
    'SELECT * FROM KART_RESULT WHERE RES_TYPE = ?;',
    req.body.type,
    function (err, selRes) {
      console.log('selRes')
      console.log(selRes)

      if (selRes.length > 0) {
        connection.query(
          'UPDATE KART_RESULT SET RES_ASCORE = ? , RES_BSCORE = ? WHERE RES_TYPE = ?;',
          [req.body.aScore, req.body.bScore, req.body.type],
          function (err, upResult) {
            if (err) {
              console.log(err)
              return
            }
            console.log(`update : ${upResult}`)
            res.json({ ok: true })
          }
        )
      } else {
        connection.query(
          'INSERT INTO KART_RESULT(RES_ASCORE,RES_BSCORE,RES_TYPE) values(?,?,?);',
          [req.body.aScore, req.body.bScore, req.body.type],
          function (err, inResult) {
            if (err) {
              console.log(err)
              return
            }
            res.json({ ok: true })
          }
        )
      }
    }
  )
})
router.post('/win/:method', async (req, res, next) => {
  const { method } = req.params

  console.log(method)
  let selQuery = ''
  switch (method) {
    case 'aWinOn': {
      selQuery = 'UPDATE KART SET ATEAMWIN = TRUE;'
      break
    }
    case 'aWinOff': {
      selQuery = 'UPDATE KART SET ATEAMWIN = FALSE;'
      break
    }
    case 'bWinOn': {
      selQuery = 'UPDATE KART SET BTEAMWIN = TRUE;'
      break
    }
    case 'bWinOff': {
      selQuery = 'UPDATE KART SET BTEAMWIN = FALSE;'
      break
    }
  }
  connection.query(selQuery, function (err, result, fields) {
    if (err) {
      console.log(err)
    } else {
      connection.query(
        'SELECT ATEAMWIN,BTEAMWIN FROM KART',
        function (err, _selResults, fields) {
          _selResults[0].ok = true
          res.json(_selResults[0])
        }
      )
    }
  })
})

module.exports = router
