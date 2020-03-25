function startJob(jobNo, sleepTime){
  console.log(["Job No: ", jobNo, "; Sleep Time: ", sleepTime])
  return null
}

function resolveAfterNSeconds(jobNo, sleepTime) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(startJob(jobNo, sleepTime))
    }, sleepTime * 1000)
  });
}
  
async function asyncCall(jobNo, sleepTime) {
  const result = await resolveAfterNSeconds(jobNo, sleepTime)
  console.log(result)
}

var interval = setInterval(intervalFunc, 1500)

var jobNo = 1
function intervalFunc() {
  asyncCall(jobNo, Math.floor(Math.random() * 20) + 1)

  jobNo++
  if (jobNo == 10){
    clearInterval(interval)
  }
}

