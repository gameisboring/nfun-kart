// index.js
const express = require('express')
const router = express.Router()
const app = express()
const controller = require('./router/controller')
const controller2 = require('./router/controller2')

const xml = require('xml')
const bodyParser = require('body-parser')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)
app.use('/controller', controller)
app.use('/controller2', controller2)
app.use('/public', express.static(__dirname + '/public'))
app.set('views', 'src/views')
app.set('view engine', 'pug')

var connection = require('./lib/db')

router.get('/', (req, res, next) => {
  res.render('empty')
})

router.get('/data', (req, res, next) => {
  // console.log(`${getTime()} | /data GET | 경기정보 XML 데이터 요청`)
  connection.query(`SELECT * FROM KART ;`, function (err, results, fields) {
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
    console.log(`${getTime()} | /data GET | 경기정보 XML 데이터 응답`)
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

    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
  })
})

router.get('/data2', async (req, res) => {
  console.log(`${getTime()} | /data2 GET | 대진표 XML 데이터 요청`)
  connection.query(
    'SELECT * FROM KART_MATCH ORDER BY MAT_ID ASC',
    (err, result) => {
      let data = `<?xml version="1.0" encoding="UTF-8"?><matches>`
      for (var i in result) {
        data += `
      <match>
        <title>${result[i].MAT_TITLE}</title>
        <ateamname>${result[i].MAT_ATEAMNAME}</ateamname>
        <ascore>${result[i].MAT_ASCORE}</ascore>
        <bteamname>${result[i].MAT_BTEAMNAME}</bteamname>
        <bscore>${result[i].MAT_BSCORE}</bscore>
      </match>`
      }
      data += '</matches>'
      res.header('Content-Type', 'application/xml')
      res.status(200).send(data)
      console.log(`${getTime()} | /data2 GET | 대진표 XML 데이터 응답`)
    }
  )
})

router.get('/data/result', async (req, res) => {
  // console.log(`${getTime()} | /data/result GET | 경기결과 XML 데이터 요청`)
  connection.query('SELECT * FROM KART_RESULT', (err, result) => {
    let data = `<?xml version="1.0" encoding="UTF-8"?><RESULT>`
    for (var i in result) {
      data += `
      <ROUND>
        <ASCORE>${result[i].RES_ASCORE}</ASCORE>
        <BSCORE>${result[i].RES_BSCORE}</BSCORE>
        <TYPE>${result[i].RES_TYPE}</TYPE>
      </ROUND>`
    }
    data += '</RESULT>'
    res.header('Content-Type', 'application/xml')
    res.status(200).send(data)
    console.log(`${getTime()} | /data/result GET | 경기결과 XML 데이터 응답`)
  })
})

router.get('/data/players', async (req, res) => {
  // console.log(`${getTime()} | /data/players GET | 선수명단 XML 데이터 요청`)
  connection.query(
    'SELECT * FROM KART_PLAYERS ORDER BY PLAYER_TEAM ASC',
    (err, result) => {
      let data = `<?xml version="1.0" encoding="UTF-8"?><선수명단>`
      for (var i in result) {
        data += `
      <선수>
        <이름>${result[i].PLAYER_NAME}</이름>
        <팀명>${result[i].PLAYER_TEAM}</팀명>
        <닉네임>${result[i].PLAYER_NICKNAME}</닉네임>
      </선수>`
      }
      data += '</선수명단>'
      console.log(`${getTime()} | /data/players GET | 선수명단 XML 데이터 응답`)
      res.header('Content-Type', 'application/xml')
      res.status(200).send(data)
    }
  )
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
  if (hours / 10 < 1) {
    hours = '0' + hours
  }
  let minutes = today.getMinutes() // 분
  if (minutes / 10 < 1) {
    minutes = '0' + minutes
  }
  let seconds = today.getSeconds() // 초
  if (seconds / 10 < 1) {
    seconds = '0' + seconds
  }
  let milliseconds = today.getMilliseconds() // 밀리초
  if (milliseconds / 10 < 1) {
    milliseconds = '00' + milliseconds
  } else if (milliseconds / 100 < 1) {
    milliseconds = '0' + milliseconds
  }

  return `${month}-${date} ${hours}:${minutes}:${seconds}(${milliseconds})`
}
const PORT = 80
app.listen(PORT, () => {
  console.log(`${getTime()}에 ${PORT}번 포트에서 서버 작동시작`)
})
