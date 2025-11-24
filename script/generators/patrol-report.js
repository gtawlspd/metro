import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generatePatrolReportBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""
  const getChecked = (id) => document.getElementById(id)?.checked || false

  const handlerName = localStorage.getItem("handlerName") || ""
  const platoon = localStorage.getItem("platoon") || ""
  const rank = localStorage.getItem("divisionalRank") || ""

  const date = formatDateForBBCode(getValue("prDate"))
  const officers = getValue("prOfficers")
  const caninePatrol = getChecked("prCaninePatrol")
  const swatPatrol = getChecked("prSWATPatrol")
  const jointPatrol = getChecked("prJointPatrol")
  const gangPatrol = getChecked("prGangPatrol")
  const additionalInfo = getValue("prAdditionalInfo")

  const officersArray = officers.split("\n").filter((o) => o.trim())

  const officersList = officersArray.join("\n")

  const deploymentEntries = document.querySelectorAll(".deployment-entry")
  console.log("[v0] Deployment entries found:", deploymentEntries.length)
  const deploymentLines = []

  deploymentEntries.forEach((entry, index) => {
    const typeInput = entry.querySelector(".deployment-type-input")
    const urlInput = entry.querySelector(".deployment-url-input")

    const type = typeInput?.value.trim() || ""
    const url = urlInput?.value.trim()

    console.log(`[v0] Deployment ${index}:`, { type, url })

    if (type && url) {
      deploymentLines.push(`[url=${url}]${type}[/url]`)
    } else if (type) {
      deploymentLines.push(type)
    }
  })

  console.log("[v0] Deployment lines:", deploymentLines)

  let deploymentsFormatted = ""
  if (deploymentLines.length > 0) {
    deploymentsFormatted = `[list]${deploymentLines[0]}`
    for (let i = 1; i < deploymentLines.length; i++) {
      deploymentsFormatted += `\n[*]${deploymentLines[i]}`
    }
    deploymentsFormatted += "[/list]"
  }

  console.log("[v0] Deployments formatted:", deploymentsFormatted)

  const additionalInfoFormatted = additionalInfo ? `${additionalInfo}` : ""

  let bbcode = ""
  bbcode += "[divbox2=transparent][font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n"
  bbcode += "[size=120][b]METROPOLITAN DIVISION\n"
  bbcode += "PATROL REPORT[/b][/size][/center]\n\n"
  bbcode += "[b]1. Date of Patrol[/b] \n"
  bbcode += `${date}\n\n`
  bbcode += "[b]2. Officers[/b]\n"
  bbcode += `${officersList}\n\n`
  bbcode += "[b]3. Patrol Type[/b]\n"
  bbcode += `[cb${caninePatrol ? "c" : ""}][/cb${caninePatrol ? "c" : ""}] Canine Patrol\n`
  bbcode += `[cb${swatPatrol ? "c" : ""}][/cb${swatPatrol ? "c" : ""}] SWAT Crime Suppression Patrol\n`
  bbcode += `[cb${jointPatrol ? "c" : ""}][/cb${jointPatrol ? "c" : ""}] Joint Crime Suppression Patrol\n`
  bbcode += `[cb${gangPatrol ? "c" : ""}][/cb${gangPatrol ? "c" : ""}] Gang Crime Suppression Patrol\n\n`
  bbcode += "[b]4. Deployments[/b]\n"
  bbcode += `${deploymentsFormatted}\n\n`
  bbcode += "[b]5. Additional Information[/b]\n"
  bbcode += `${additionalInfoFormatted}\n[/font][/divbox2]`

  const outputElem = document.getElementById("prBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  const deploymentsData = []
  deploymentEntries.forEach((entry) => {
    const typeInput = entry.querySelector(".deployment-type-input")
    const urlInput = entry.querySelector(".deployment-url-input")
    deploymentsData.push({
      type: typeInput?.value || "",
      url: urlInput?.value || "",
    })
  })

  saveReport("patrolReport", {
    date: getValue("prDate"),
    officers,
    caninePatrol,
    swatPatrol,
    jointPatrol,
    gangPatrol,
    deployments: deploymentsData,
    additionalInfo,
    bbcode,
  })
}
