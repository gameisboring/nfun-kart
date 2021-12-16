const aNameInput = document.querySelector('#aname')
const aScoreInput = document.querySelector('#ascore')
const bNameInput = document.querySelector('#bname')
const bScoreInput = document.querySelector('#bscore')
const titleInput = document.querySelector('#title')

const submitBtn = document.querySelector('#submitBtn')
const changeBtn = document.querySelector('#changeBtn')
const clearBtn = document.querySelector('#clearBtn')

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
      .then((response) => {
        response.json()
      })
      .then((json) => {
        if (json.ok) {
          alert('수정 성공')

          const monitor = document.querySelector('#monitor')
          const monitorChilderen = monitor.childNodes

          console.log(monitorChilderen)
          monitorChilderen[0].innerText = '라운드 제목 : ' + json.TITLE
          monitorChilderen[1].innerText = 'A팀 이름 : ' + json.ATEAMNAME
          monitorChilderen[2].innerText = 'B팀 이름 : ' + json.BTEAMNAME
          monitorChilderen[3].innerText = 'A팀 점수 : ' + json.ASCORE
          monitorChilderen[4].innerText = 'B팀 점수 : ' + json.BSCORE
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
    body: JSON.stringify(data),
  })
})

clearBtn.addEventListener('click', function () {
  fetch('/controller/clear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
})
