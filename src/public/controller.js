const aNameInput = document.querySelector('#aname')
const aScoreInput = document.querySelector('#ascore')
const bNameInput = document.querySelector('#bname')
const bScoreInput = document.querySelector('#bscore')
const titleInput = document.querySelector('#title')

const submitBtn = document.querySelector('#submitBtn')
const changeBtn = document.querySelector('#changeBtn')
const clearBtn = document.querySelector('#clearBtn')

const aWin = document.querySelector('#aWin')
const bWin = document.querySelector('#bWin')
const clearWin = document.querySelector('#clearWin')
const draw = document.querySelector('#draw')

function checkScreen() {
  const windowWidth = window.innerWidth
  if (windowWidth <= 768) {
    return
  } else {
    return
  }
}

document.addEventListener('resize', checkScreen())

submitBtn.addEventListener('click', function () {
  if (
    aNameInput.value &&
    bNameInput.value &&
    aScoreInput.value &&
    bScoreInput.value &&
    titleInput.value
  ) {
    const data = {
      title: titleInput.value,
      aName: aNameInput.value,
      bName: bNameInput.value,
      aScore: aScoreInput.value,
      bScore: bScoreInput.value,
    }

    fetch('/controller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.ok) {
          document.querySelector('#_title').innerText = json.TITLE
          document.querySelector('#_aname').innerText = json.ATEAMNAME
          document.querySelector('#_bname').innerText = json.BTEAMNAME
          document.querySelector('#_ascore').innerText = json.ASCORE
          document.querySelector('#_bscore').innerText = json.BSCORE
        } else {
          alert('수정 실패')
        }
      })
  } else {
    alert('데이터를 전부 입력해주세요')
  }
})

changeBtn.addEventListener('click', function () {
  fetch('/controller/change', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.ok) {
        document.querySelector('#_title').innerText = json.TITLE
        document.querySelector('#_aname').innerText = json.ATEAMNAME
        document.querySelector('#_bname').innerText = json.BTEAMNAME
        document.querySelector('#_ascore').innerText = json.ASCORE
        document.querySelector('#_bscore').innerText = json.BSCORE
      }
    })
})

clearBtn.addEventListener('click', function () {
  fetch('/controller/clear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.ok) {
        document.querySelector('#_title').innerText = json.TITLE
        document.querySelector('#_aname').innerText = json.ATEAMNAME
        document.querySelector('#_bname').innerText = json.BTEAMNAME
        document.querySelector('#_ascore').innerText = json.ASCORE
        document.querySelector('#_bscore').innerText = json.BSCORE
      }
    })
})

aWin.addEventListener('click', winBtnClickFunc)
bWin.addEventListener('click', winBtnClickFunc)
draw.addEventListener('click', winBtnClickFunc)
clearWin.addEventListener('click', winBtnClickFunc)

function winBtnClickFunc(event) {
  let team = event.target.id

  fetch(`/controller/${team}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.ok) {
        if (json.ATEAMWIN && !json.BTEAMWIN) {
          document.querySelector('#_win').innerText = 'A팀 승리'
        } else if (!json.ATEAMWIN && json.BTEAMWIN) {
          document.querySelector('#_win').innerText = 'B팀 승리'
        } else if (json.ATEAMWIN && json.BTEAMWIN) {
          document.querySelector('#_win').innerText = '무승부'
        } else {
          document.querySelector('#_win').innerText = '데이터 없음'
        }
      }
    })
}
