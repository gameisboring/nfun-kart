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
  host: 'mysql',
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
      } else if (ATEAMWIN && BTEAMWIN) {
        WHICHTEAMWIN = '무승부'
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

router.get('/data', (req, res, next) => {
  const selectKartQuery = `SELECT * FROM KART ;`

  connection.query(selectKartQuery, function (err, results, fields) {
    if (err) {
      console.log(err)
      res.status(500).send('데이터 조회에 실패했습니다')
      return
    }

    if (results.length < 1) {
      let data = `<?xml version="1.0" encoding="UTF-8"?>
      <league>
    <title>none</title>
    <name_a>none</name_a>
    <name_b>none</name_b>
    <score_a>0</score_a>
    <score_b>0</score_b>
    <win_a>false</win_a>
    <win_b>false</win_b>
    </league>`

      res.header('Content-Type', 'application/xml')
      res.status(200).send(data)
      return
    }

    const result = results[0]

    let data = `<?xml version="1.0" encoding="UTF-8"?>
    <league>
    <title>${result.TITLE}</title>
    <name_a>${result.ATEAMNAME}</name_a>
    <name_b>${result.BTEAMNAME}</name_b>
    <score_a>${result.ASCORE}</score_a>
    <score_b>${result.BSCORE}</score_b>
    <win_a>${result.ATEAMWIN}</win_a>
    <win_b>${result.BTEAMWIN}</win_b>
    </league>`

    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
  })
})

router.get('/players', (req, res, next) => {
  const selectKartQuery = `SELECT PLAYER_NAME, PLAYER_PROFILE, TEAM_NAME, TEAM_LOGO FROM KART_TEAMS, KART_PLAYERS WHERE KART_TEAMS.TEAM_NAME = KART_PLAYERS.PLAYER_TEAM;`

  connection.query(selectKartQuery, function (err, results, fields) {
    if (err) {
      console.log(err)
      res.status(500).send('데이터 조회에 실패했습니다')
      return
    }

    if (results.length < 1) {
      res.header('Content-Type', 'application/xml')
      res.status(200).send('입력된 데이터가 없습니다')
      return
    }

    let data = '<?xml version="1.0" encoding="ASCII"?><root>'
    for (i in results) {
      data += `
      <player>
      <player_name>${results[i].PLAYER_NAME}</player_name>
      <player_profile>${results[i].PLAYER_PROFILE}</player_profile>
      <team_name>${results[i].TEAM_NAME}</team_name>
      <team_logo>${results[i].TEAM_LOGO}</team_logo>
      </player>`
    }
    data += `</root>`

    console.log(data)

    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
  })
})

router.get('/teams', (req, res, next) => {
  const selectKartQuery = `SELECT * FROM KART_TEAMS;`

  connection.query(selectKartQuery, function (err, results, fields) {
    if (err) {
      console.log(err)
      res.status(500).send('데이터 조회에 실패했습니다')
      return
    }

    if (results.length < 1) {
      res.header('Content-Type', 'application/xml')
      res.status(200).send('입력된 데이터가 없습니다')
      return
    }
    let data = '<?xml version="1.0" encoding="UTF-8"?><root>'
    for (i in results) {
      data += `
      <team>
      <team_name>${results[i].TEAM_NAME}</team_name>
      <team_logo>${results[i].TEAM_LOGO}</team_logo>
      </team>`
    }
    data += `</root>`
    console.log(data)

    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
  })
})

router.post('/controller/change', async (req, res, next) => {
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

router.post('/controller/clear', async (req, res, next) => {
  await connection.query(
    'UPDATE KART SET ASCORE = 0 , BSCORE = 0;',
    function (err, results, fields) {
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
    }
  )
})

router.post('/controller/aWin', async (req, res, next) => {
  connection.query(
    'UPDATE KART SET ATEAMWIN = TRUE , BTEAMWIN = FALSE;',
    function (err, result, fields) {
      if (err) {
        console.log(err)
      } else {
        connection.query(
          'SELECT ATEAMWIN, BTEAMWIN FROM KART',
          function (err, _selResults, fields) {
            _selResults[0].ok = true
            res.json(_selResults[0])
          }
        )
      }
    }
  )
  console.log('awin')
})

router.post('/controller/bWin', async (req, res, next) => {
  connection.query(
    'UPDATE KART SET BTEAMWIN = TRUE , ATEAMWIN = FALSE;',
    function (err, result, fields) {
      if (err) {
        console.log(err)
      } else {
        connection.query(
          'SELECT ATEAMWIN, BTEAMWIN FROM KART',
          function (err, _selResults, fields) {
            _selResults[0].ok = true
            res.json(_selResults[0])
          }
        )
      }
    }
  )
  console.log('bwin')
})

router.post('/controller/clearWin', async (req, res, next) => {
  connection.query(
    'UPDATE KART SET BTEAMWIN = FALSE , ATEAMWIN = FALSE;',
    function (err, result, fields) {
      if (err) {
        console.log(err)
      } else {
        connection.query(
          'SELECT ATEAMWIN, BTEAMWIN FROM KART',
          function (err, _selResults, fields) {
            _selResults[0].ok = true
            res.json(_selResults[0])
          }
        )
      }
    }
  )
  console.log('데이터 없음')
})

router.post('/controller/draw', async (req, res, next) => {
  connection.query(
    'UPDATE KART SET BTEAMWIN = TRUE , ATEAMWIN = TRUE;',
    function (err, result, fields) {
      if (err) {
        console.log(err)
      } else {
        connection.query(
          'SELECT ATEAMWIN, BTEAMWIN FROM KART',
          function (err, _selResults, fields) {
            _selResults[0].ok = true
            res.json(_selResults[0])
          }
        )
      }
    }
  )
  console.log('무승부')
})

const PORT = 80
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`)
})
