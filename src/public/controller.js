const aNameInput = document.querySelector('#aname')
const aScoreInput = document.querySelector('#ascore')
const bNameInput = document.querySelector('#bname')
const bScoreInput = document.querySelector('#bscore')
const titleInput = document.querySelector('#title')

const submitBtn = document.querySelector('#submitBtn')
const changeBtn = document.querySelector('#changeBtn')
const clearBtn = document.querySelector('#clearBtn')

const aWinOff = document.querySelector('#aWinOff')
const bWinOff = document.querySelector('#bWinOff')
const aWinOn = document.querySelector('#aWinOn')
const bWinOn = document.querySelector('#bWinOn')

function checkScreen() {
  const windowWidth = window.innerWidth
  if (windowWidth <= 768) {
    return
  } else {
    return
  }
}

document.addEventListener('resize', checkScreen())

// 수정하기 버튼 클릭 이벤트 발생
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

//팀 교대 버튼 클릭 이벤트 발생
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

        document.querySelector('#aname').value = json.ATEAMNAME
        document.querySelector('#bname').value = json.BTEAMNAME

        document.querySelector('#ascore').value = json.ASCORE
        document.querySelector('#bscore').value = json.BSCORE
      }
    })
})

// 점수 초기화 버튼 클릭 이벤트 발생
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

        document.querySelector('#ascore').value = json.ASCORE
        document.querySelector('#bscore').value = json.BSCORE
      }
    })
})

// A팀 승리 ON 버튼 클릭 이벤트 발생
aWinOn.addEventListener('click', winBtnClickFunc)
// B팀 승리 ON  버튼 클릭 이벤트 발생
bWinOn.addEventListener('click', winBtnClickFunc)
// B팀 승리 OFF 버튼 클릭 이벤트 발생
aWinOff.addEventListener('click', winBtnClickFunc)
// B팀 승리 OFF 버튼 클릭 이벤트 발생
bWinOff.addEventListener('click', winBtnClickFunc)

function winBtnClickFunc(event) {
  let team = event.target.id
  console.log(team)
  fetch(`/controller/${team}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      winBtnChange()
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

function winBtnChange() {
  $.ajax({
    url: '/controller/data',
    dataType: 'Json',
    type: 'POST',
    success: (res) => {
      if (res.isEmpty) {
        console.log('fail!')
      }

      if (res[0].ATEAMWIN) {
        $('#aWinOff').removeClass('hidden')
        $('#aWinOn').addClass('hidden')
      } else {
        $('#aWinOn').removeClass('hidden')
        $('#aWinOff').addClass('hidden')
      }

      if (res[0].BTEAMWIN) {
        $('#bWinOff').removeClass('hidden')
        $('#bWinOn').addClass('hidden')
      } else {
        $('#bWinOn').removeClass('hidden')
        $('#bWinOff').addClass('hidden')
      }
    },
    error: (res) => {
      console.log('fail!')
    },
  })
}

$(document).ready(function () {
  winBtnChange()
})
