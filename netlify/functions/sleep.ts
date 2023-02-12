import type { Handler } from '@netlify/functions'

async function fetchLastSleep(ouraKey: string) {
  const now = new Date()
  const startDate = new Date(now.getTime() - 60 * 60 * 24 * 1000)
    .toISOString()
    .substring(0, 10)
  const endDate = now.toISOString().substring(0, 10)

  const resp = await fetch(
    `https://api.ouraring.com/v2/usercollection/sleep?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${ouraKey}`,
      },
    },
  )
  const sleepListing = await resp.json()

  const longSleeps =
    sleepListing?.data.filter((x: any) => x.type === 'long_sleep') ?? []
  return longSleeps.at(-1)
}

const handler: Handler = async () => {
  const ouraKey = process.env.OURA_KEY
  if (ouraKey == undefined) {
    return {
      statusCode: 500,
    }
  }

  const sleepData = await fetchLastSleep(ouraKey)
  const respData = {
    last_end: sleepData.bedtime_end,
    last_duration: sleepData.total_sleep_duration,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(respData),
  }
}

export { handler }
