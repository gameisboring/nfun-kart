// index.js
const express = require('express')
const router = express.Router()
const app = express()

const mysql = require('mysql')

const xml = require('xml')
const bodyParser = require('body-parser')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)
app.use('/public', express.static(__dirname + '/public'))
app.set('views', 'src/views')
app.set('view engine', 'pug')

var connection = mysql.createConnection({
  // host 바꾸기
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: '153153',
  database: 'nfun',
})

connection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

router.get('/', (req, res, next) => {
  res.render('empty')
})
router.get('/controller', (req, res, next) => {
  connection.query('SELECT * FROM KART', function (err, selResults, fields) {
    if (selResults.length < 1) {
      res.render('controller')
    } else {
      const { ASCORE, BSCORE, ATEAMNAME, BTEAMNAME, TITLE } = selResults[0]

      res.render('controller', {
        title: TITLE,
        score_a: ASCORE,
        score_b: BSCORE,
        name_a: ATEAMNAME,
        name_b: BTEAMNAME,
      })
    }
  })
})

router.post('/controller', async (req, res, next) => {
  console.log(
    `aname : ${req.body.aName} / ascore : ${req.body.aScore} / bname : ${req.body.bName} / bscore : ${req.body.bScore}`
  )
  if (!req.body) {
    return
  }
  await connection.query(
    'SELECT * FROM KART',
    function (err, selResults, fields) {
      if (selResults.length < 1) {
        connection.query(
          `INSERT INTO KART(ATEAMNAME,BTEAMNAME,ASCORE,BSCORE,TITLE) VALUES('${req.body.aName}','${req.body.bName}',ASCORE = '${req.body.aScore}' , BSCORE = '${req.body.bScore}' , TITLE = '${req.body.title}';)`,
          function (err, insertResults, fields) {
            console.log(insertResults)
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
                console.log(_selResults)
                _selResults.ok = true
                res.json(_selResults[0])
              }
            )
          }
        })
      }
    }
  )
})
router.get('/data', (req, res, next) => {
  const selectKartQuery = `SELECT * FROM KART ;`

  connection.query(selectKartQuery, function (err, results, fields) {
    if (err) {
      console.log(err)
      res.status(500).send('데이터 조회에 실패했습니다')
    }

    const result = results[0]

    let data = `<?xml version="1.0" encoding="UTF-8"?>
    <league>
    <title>
        ${result.TITLE}
    </title>
    <name_a>
        ${result.ATEAMNAME}
    </name_a>
    <name_b>
        ${result.BTEAMNAME}
    </name_b>
    <score_a>
        ${result.ASCORE}
    </score_a>
    <score_b>
        ${result.BSCORE}
    </score_b>
    </league>`

    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
  })
})

router.post('/controller/change', async (req, res, next) => {})

router.post('/controller/clear', async (req, res, next) => {
  await connection.query('DELETE FROM KART', function (err, results, fields) {
    console.log(results)
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`)
})
