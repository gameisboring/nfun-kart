const express = require('express')
const router = express.Router()
var connection = require('../lib/db')

router.get('/', async (req, res, next) => {
  console.log(`${getTime()} | /controller2 GET | 컨트롤러2 페이지 요청`)
  res.render('controller2')
  console.log(`${getTime()} | /controller2 GET | 컨트롤러2 페이지 응답`)
})

router.post('/', async (req, res, next) => {
  console.log(`${getTime()} | /controller2 POST | 대진표 수정 요청`)
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
      console.log(`${getTime()} | /controller2 POST | KART_MATCH 데이터 수정`)
      if (err) {
        console.log(err)
      } else {
        connection.query(
          `SELECT * FROM KART_MATCH WHERE MAT_TITLE = '${req.body.MAT_TITLE}'`,
          function (err, selResults, fields) {
            console.log(
              `${getTime()} | /controller2 POST | KART_MATCH 경기별 데이터 조회`
            )
            if (err) {
              console.log(err)
              return
            }
            res.json(selResults)
            console.log(`${getTime()} | /controller2 POST | 대진표 수정 응답`)
          }
        )
      }
    }
  )
})
router.get('/data', async (req, res, next) => {
  console.log(`${getTime()} | /controller2/data GET | 경기 데이터 요청`)
  if (req.body) {
    await connection.query(
      `SELECT * FROM KART_MATCH WHERE MAT_TITLE = '${req.query.MAT_TITLE}'`,
      function (err, result, fields) {
        console.log(
          `${getTime()} | /controller2/data GET | KART_MATCH 경기별 데이터 조회`
        )
        if (err) {
          console.log(err)
          return
        }
        console.log(`${getTime()} | /controller2/data GET | 경기 데이터 응답`)
        res.json(result)
      }
    )
  }
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
