const payload = JSON.parse(process.env.PAYLOAD)

const record = payload.record
const table = payload.table

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

async function getPilot(user_id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pilots?user_id=eq.${user_id}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  )

  const data = await res.json()
  return data[0]
}

function formatFlightTime(hours) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)

  if (h && m) return `${h} hrs ${m} mins`
  if (h) return `${h} hrs`
  return `${m} mins`
}

async function sendDiscord(embed) {
  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] })
  })
}

async function handlePirep() {
  const pilot = await getPilot(record.pilot_id)

  const totalTime = record.flight_hours * record.multiplier
  const formattedTime = formatFlightTime(totalTime)

  let cargoText = ""

  if (record.flight_type === "cargo")
    cargoText = `📦 **Cargo:** ${record.cargo_kg} kg`
  else
    cargoText = `👥 **Passengers:** ${record.pax}`

  const embed = {
    title: "New PIREP Submitted",
    description:
`🛫 **Flight:** ${record.flight_number}

🛣️ **Route:** ${record.dep_icao} → ${record.arr_icao}

👨‍✈️ **Pilot:** ${pilot.full_name} (\`${pilot.callsign}\`)

✈️ **Aircraft:** ${record.aircraft_icao}

⏱️ **Flight Time:** ${formattedTime}

${cargoText}

📅 **Submitted:** ${new Date().toLocaleString()}

[View PIREP](https://www.crewcenterkeva.com/admin/pireps)`,

    footer: {
      text: `Powered by VACompany | ${new Date().toLocaleTimeString()}`
    }
  }

  await sendDiscord(embed)
}

async function handleATC() {
  const pilot = await getPilot(record.user_id)

  const embed = {
    title: "New ATC PIREP Submitted",
    description:
`👨‍✈️ **Controller:** ${pilot.full_name} (\`${pilot.callsign}\`)

✈️ **Airport:** ${record.airport_icao}

📅 **Submitted:** ${new Date().toLocaleString()}

[View ATC PIREP](https://crewcenterkeva.com/admin/atc-pirep)`,

    footer: {
      text: `Powered by VACompany | ${new Date().toLocaleTimeString()}`
    }
  }

  await sendDiscord(embed)
}

if (table === "pireps") handlePirep()
if (table === "atc_pireps") handleATC()
