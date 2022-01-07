const express = require('express')
const router = express.Router()
var connection = require('../lib/db')

router.get('/', (req, res, next) => {
  console.log(`${getTime()} '/controller GET' 컨트롤러 페이지 요청`)
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

      console.log(`${getTime()} '/controller GET' 컨트롤러 페이지 응답`)
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
  console.log(`${getTime()} '/controller POST' 수정 요청`)
  if (!req.body) {
    return
  }
  await connection.query(
    'SELECT * FROM KART',
    function (err, selResults, fields) {
      console.log(`${getTime()} '/controller POST' KART 데이터 조회`)
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
              console.log(`${getTime()} '/controller POST' KART 데이터 삽입`)
              connection.query(
                'SELECT * FROM KART',
                function (err, _selResults, fields) {
                  res.status(200)
                  _selResults[0].ok = true
                  res.json(_selResults[0])
                  console.log(`${getTime()} '/controller POST' 수정(삽입) 응답`)
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
            console.log(`${getTime()} '/controller POST' KART 데이터 수정`)
            connection.query(
              'SELECT * FROM KART',
              function (err, _selResults, fields) {
                console.log(`${getTime()} '/controller POST' KART 데이터 조회`)
                res.status(200)
                _selResults[0].ok = true
                res.json(_selResults[0])
                console.log(`${getTime()} '/controller POST' 수정(수정) 응답`)
              }
            )
          }
        })
      }
    }
  )
})

router.post('/change', async (req, res, next) => {
  console.log(`${getTime()} '/controller/change POST' 팀 교대 요청`)
  const query = `update kart set ateamname = (@name_temp:=ateamname), ateamname = bteamname , bteamname = @name_temp, ascore = (@score_temp:=ascore), ascore = bscore, bscore = @score_temp;`
  await connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err)
    } else {
      connection.query(
        'SELECT * FROM KART',
        function (err, _selResults, fields) {
          console.log(`${getTime()} '/controller/change POST' KART 데이터 조회`)
          _selResults[0].ok = true
          res.json(_selResults[0])
          console.log(`${getTime()} '/controller/change POST' 팀 교대 응답`)
        }
      )
    }
  })
})

router.post('/clear', (req, res, next) => {
  console.log(`${getTime()} '/controller/clear' 점수초기화 요청`)
  connection.query(
    'UPDATE KART SET ASCORE = 0 , BSCORE = 0;',
    function (err, results, fields) {
      if (err) {
        console.log(err)
        return
      }
      console.log(`${getTime()} '/controller/change' KART 점수 초기화`)
    }
  )
  connection.query(
    'UPDATE KART_RESULT SET RES_ASCORE = 0 , RES_BSCORE = 0;',
    function (err, results, fields) {
      if (err) {
        console.log(err)
        return
      }
      console.log(`${getTime()} '/controller/change' KART_RESULT 점수 초기화`)
    }
  )

  connection.query('SELECT * FROM KART', function (err, _selResults, fields) {
    _selResults[0].ok = true
    res.json(_selResults[0])
    console.log(`${getTime()} '/controller/change' 점수초기화 결과 응답`)
  })
})
router.post('/data', async (req, res, next) => {
  console.log(`${getTime()}  | /controller/data |  데이터 요청`)
  connection.query(
    'SELECT ATEAMWIN,BTEAMWIN FROM KART;',
    function (err, result) {
      res.json(result)
      console.log(`${getTime()}  | /controller/data |  데이터 응답`)
    }
  )
})
router.get('/result', async (req, res, next) => {
  console.log(`${getTime()} | /controller/result |  데이터 요청`)
  connection.query('SELECT * FROM KART_RESULT;', function (err, result) {
    res.json(result)
    console.log(`${getTime()} | /controller/result |  데이터 응답`)
  })
})
router.post('/result', async (req, res, next) => {
  console.log(`${getTime()} | /controller/result POST | 요청`)
  connection.query(
    'SELECT * FROM KART_RESULT WHERE RES_TYPE = ?;',
    req.body.type,
    function (err, selRes) {
      console.log(`${getTime()} | /controller/result POST | 데이터 조회`)
      if (selRes.length > 0) {
        connection.query(
          'UPDATE KART_RESULT SET RES_ASCORE = ? , RES_BSCORE = ? WHERE RES_TYPE = ?;',
          [req.body.aScore, req.body.bScore, req.body.type],
          function (err, upResult) {
            if (err) {
              console.log(err)
              return
            }
            console.log(`${getTime()} | /controller/result | KART_RESULT 수정 `)
            res.json({ ok: true })

            console.log(`${getTime()} | /controller/result POST | 응답`)
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
            console.log(`${getTime()} | /controller/result POST | 데이터 삽입`)
            res.json({ ok: true })

            console.log(`${getTime()} | /controller/result POST | 응답`)
          }
        )
      }
    }
  )
})
router.post('/win/:method', async (req, res, next) => {
  console.log(`${getTime()} | /controller/win | 승리 버튼 클릭`)
  const { method } = req.params

  let selQuery = ''
  switch (method) {
    case 'aWinOn': {
      selQuery = 'UPDATE KART SET ATEAMWIN = TRUE;'
      console.log(`${getTime()} | /controller/win |  A팀 승리 !ON!`)
      break
    }
    case 'aWinOff': {
      selQuery = 'UPDATE KART SET ATEAMWIN = FALSE;'
      console.log(`${getTime()} | /controller/win | A팀 승리 !OFF!`)
      break
    }
    case 'bWinOn': {
      selQuery = 'UPDATE KART SET BTEAMWIN = TRUE;'
      console.log(`${getTime()} | /controller/win | B팀 승리 !ON!`)
      break
    }
    case 'bWinOff': {
      selQuery = 'UPDATE KART SET BTEAMWIN = FALSE;'
      console.log(`${getTime()} | /controller/win | B팀 승리 !OFF!`)
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
          console.log(`${getTime()} | /controller/win | POST 응답`)
        }
      )
    }
  })
})

function getTime() {
  let today = new Date()
  let month = today.getMonth() + 1 // 월
  if (month / 10 < 1) {
    month = '0' + month
  }
  let date = today.getDate() // 날짜
  if (date / 10 < 1) {
    date = '0' + date
  }
  let hours = today.getHours() // 시
  let minutes = today.getMinutes() // 분
  let seconds = today.getSeconds() // 초
  let milliseconds = today.getMilliseconds() // 밀리초

  return `${month}-${date} ${hours}:${minutes}:${seconds}(${milliseconds})`
}

module.exports = router
