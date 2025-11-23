import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generatePatrolReportBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""
  const getChecked = (id) => document.getElementById(id)?.checked || false

  const date = formatDateForBBCode(getValue("prDate"))
  const officers = getValue("prOfficers")
  const caninePatrol = getChecked("prCaninePatrol")
  const swatPatrol = getChecked("prSWATPatrol")
  const jointPatrol = getChecked("prJointPatrol")
  const gangPatrol = getChecked("prGangPatrol")
  const deployments = getValue("prDeployments")
  const additionalInfo = getValue("prAdditionalInfo")

  const officersList = officers
    .split("\n")
    .filter((o) => o.trim())
    .join("\n")

  let bbcode = ""
  bbcode += "[divbox2=transparent][font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n"
  bbcode += "[size=120][b]METROPOLITAN DIVISION\n"
  bbcode += "PATROL REPORT[/b][/size][/center]\n\n"
  bbcode += "[b]1. Date of Patrol[/b] \n"
  bbcode += `${date}\n\n`
  bbcode += "[b]2. Officers[/b]\n"
  bbcode += `${officersList}\n\n`
  bbcode += "[b]3. Patrol Type[/b]\n"
  bbcode += "[cb]" + (caninePatrol ? "c" : "") + "[/cb] Canine Patrol\n"
  bbcode += "[cb]" + (swatPatrol ? "c" : "") + "[/cb] SWAT Crime Suppression Patrol\n"
  bbcode += "[cb]" + (jointPatrol ? "c" : "") + "[/cb] Joint Crime Suppression Patrol\n"
  bbcode += "[cb]" + (gangPatrol ? "c" : "") + "[/cb] Gang Crime Suppression Patrol\n\n"
  bbcode += "[b]4. Deployments[/b]\n"
  bbcode += `${deployments}\n\n`
  bbcode += "[b]5. Additional Information[/b]\n"
  bbcode += `${additionalInfo}`

  const outputElem = document.getElementById("prBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("patrolReport", {
    date,
    officers: officers.split("\n")[0],
  })
}
