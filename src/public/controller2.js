const match_8_1 = $('#8-1-match input')
const match_8_2 = $('#8-2-match input')
const match_8_3 = $('#8-3-match input')
const match_8_4 = $('#8-4-match input')
const match_4_1 = $('#4-1-match input')
const match_4_2 = $('#4-2-match input')
const match_F_1 = $('#f-match input')

$(document).ready(function () {
  dataRender(match_8_1)
  dataRender(match_8_2)
  dataRender(match_8_3)
  dataRender(match_8_4)
  dataRender(match_4_1)
  dataRender(match_4_2)
  dataRender(match_F_1)
})

function dataRender(el) {
  $.ajax({
    url: 'controller2/data',
    type: 'GET',
    dataType: 'Json',
    data: { MAT_TITLE: el[0].value },
    success: (res) => {
      ;(el[0].value = res[0].MAT_TITLE),
        (el[1].value = res[0].MAT_ATEAMNAME),
        (el[2].value = res[0].MAT_ASCORE),
        (el[3].value = res[0].MAT_BTEAMNAME),
        (el[4].value = res[0].MAT_BSCORE)
    },
  })

  $.ajax({
    url: '/register',
    type: 'POST',
    dataType: 'Json',
    data: { data: 'data' },
    success: (res) => {
      console.log(res)
      Swal.fire({
        icon: 'success',
        text: '사전등록에 성공했습니다',
      })
    },
    error: (err) => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        text: '사전등록에 실패했습니다',
      })
    },
  })
}

$('#submitBtn').click(function () {
  matchData(match_8_1)
  matchData(match_8_2)
  matchData(match_8_3)
  matchData(match_8_4)
  matchData(match_4_1)
  matchData(match_4_2)
  matchData(match_F_1)
})

function matchData(el, check) {
  let data = {
    MAT_TITLE: el[0].value,
    MAT_ATEAMNAME: el[1].value,
    MAT_ASCORE: el[2].value,
    MAT_BTEAMNAME: el[3].value,
    MAT_BSCORE: el[4].value,
  }
  $.ajax({
    url: '/controller2',
    type: 'POST',
    dataType: 'json',
    data: data,
    success: (res) => {
      if (!res) {
        alert('데이터 수정 실패!')
      } else {
        return
      }
    },
    error: (req, stat, err) => {
      if (err) {
        console.log(err)
      }
    },
  })
}
