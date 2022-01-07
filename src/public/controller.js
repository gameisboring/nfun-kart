const aNameInput = document.querySelector('#aname')
const aScoreInput = document.querySelector('#ascore')
const bNameInput = document.querySelector('#bname')
const bScoreInput = document.querySelector('#bscore')
const titleInput = document.querySelector('#title')

const submitBtn = document.querySelector('#submitBtn')
const saveBtn = document.querySelector('#saveBtn')
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

function findSelection(field) {
  var test = 'document.theForm.' + field
  var sizes = test

  alert(sizes)
  for (i = 0; i < sizes.length; i++) {
    if (sizes[i].checked == true) {
      alert(sizes[i].value + ' you got a value')
      return sizes[i].value
    }
  }
}

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

// 라운드 저장 버튼 클릭 이벤트 발생
saveBtn.addEventListener('click', function () {
  var matchTypeRadio = $("input[name='matchType']:checked").val()
  console.log(matchTypeRadio)

  if (matchTypeRadio === undefined) {
    alert('경기 타입을 선택해주세요')
  } else {
    if (confirm('저장하시겠습니까?')) {
      if (
        aNameInput.value &&
        bNameInput.value &&
        aScoreInput.value &&
        bScoreInput.value
      ) {
        const data = {
          aName: aNameInput.value,
          bName: bNameInput.value,
          aScore: aScoreInput.value,
          bScore: bScoreInput.value,
          type: matchTypeRadio,
        }

        fetch('/controller/result', {
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
              getResult()
            } else {
              alert('수정 실패')
            }
          })
      } else {
        alert('데이터를 전부 입력해주세요')
      }
      aScoreInput.value = 0
      bScoreInput.value = 0
    }
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

  getResult()
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
  fetch(`/controller/win/${team}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      winBtnChange()
      if (json.ok) {
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

function getResult() {
  $.ajax({
    url: '/controller/result',
    dataType: 'Json',
    type: 'GET',
    success: (res) => {
      if (res.isEmpty) {
        console.log('fail!')
      }

      for (var i in res) {
        if (res[i].RES_TYPE === 'speed') {
          document.querySelector('#speed_ascore').innerText = res[i].RES_ASCORE
          document.querySelector('#speed_bscore').innerText = res[i].RES_BSCORE
        } else if (res[i].RES_TYPE === 'item') {
          document.querySelector('#item_ascore').innerText = res[i].RES_ASCORE
          document.querySelector('#item_bscore').innerText = res[i].RES_BSCORE
        } else if (res[i].RES_TYPE === 'ace') {
          document.querySelector('#ace_ascore').innerText = res[i].RES_ASCORE
          document.querySelector('#ace_bscore').innerText = res[i].RES_BSCORE
        }
      }
    },
    error: (res) => {
      console.log('fail!')
    },
  })
}

$(document).ready(function () {
  winBtnChange()
  getResult()
})
