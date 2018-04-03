/**
 * 获取验证码倒计时
 * execFn 倒计时中函数
 * endFn 倒计时结束时函数
 * time 倒计时长，默认60s
 */
const countdown = (execFn, endFn, time = 60) => {
  const timer = (t) => {
    if (t === 0) {
      endFn(time)
    } else {
      setTimeout(timer, 1000, --t)
      execFn(t)
    }
  }
  timer(time)
}

// 格式化数字 '08'
const fmtDigits = (num) => {
  return num > 9 ? num : '0' + num
}

/**
 * 活动倒计时 xx天xx时xx分xx秒
 * date 活动结束时间
 * execFn 计时中函数
 * errFn 异常时间函数
 */
const timedown = (date, execFn, errFn) => {
  if (typeof date === 'string') date = new Date(date)
  let time = date.getTime() - Date.now()
  if (time <= 0) {
    if (typeof errFn === 'function') errFn()
    throw '结束时间必须大于当前时间'
  }

  time = Math.floor(time / 1000)
  let [day, hour, minute, second] = [0, 0, 0, 0]
  const timer = () => {
    setTimeout(() => {
      let t = --time
      if (t > 0) {
        day = Math.floor(t / 8.64e4)
        t -= day * 8.64e4
        hour = Math.floor(t / 3.6e3)
        t -= hour * 3.6e3
        minute = Math.floor(t / 60)
        second = t - minute * 60
        let fmtDate = {
          day,
          hour: fmtDigits(hour),
          minute: fmtDigits(minute),
          second: fmtDigits(second)
        }
        execFn(fmtDate)
        timer()
      }
    }, 1000)
  }
  timer()
}

module.exports = {
  countdown,
  timedown
}
