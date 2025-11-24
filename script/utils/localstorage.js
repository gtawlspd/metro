import { hideAllSections } from "./ui.js"

export function saveReport(type, data) {
  const report = {
    type,
    title: "",
    data,
  }

  if (type === "canineDeployment") {
    report.title = `${data.handlerName} - Deployment - ${data.date} ${data.time}`
  } else if (type === "canineBite") {
    report.title = `${data.handlerName} - Bite - ${data.date} ${data.time}`
  } else if (type === "canineSearch") {
    report.title = `${data.handlerName} - Search - ${data.date}`
  } else if (type === "metroDeployment") {
    report.title = `Metro Deployment - ${data.date}`
  } else if (type === "patrolReport") {
    report.title = `Patrol - ${data.date}`
  }

  const savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  savedReports.push(report)
  localStorage.setItem("savedReports", JSON.stringify(savedReports))
  loadSavedReports()
}

export function loadSavedReports() {
  const reports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  const dropdown = document.getElementById("savedReportsDropdown")

  if (!dropdown) return

  dropdown.innerHTML = ""

  reports.forEach((report) => {
    const wrapper = document.createElement("div")
    wrapper.className = "report-entry"

    const a = document.createElement("a")
    a.href = "#"
    a.textContent = report.title
    a.style.flex = "1"
    a.addEventListener("click", (e) => {
      e.preventDefault()
      loadReport(report)
    })

    const del = document.createElement("button")
    del.textContent = "❌"
    del.title = "Delete Report"
    del.className = "delete-report-btn"
    del.addEventListener("click", (e) => {
      e.stopPropagation()
      if (confirm(`Delete "${report.title}"?`)) {
        deleteReport(report.title)
      }
    })

    wrapper.appendChild(a)
    wrapper.appendChild(del)
    dropdown.appendChild(wrapper)
  })
}

export function loadReport(report) {
  hideAllSections()

  const { type, data } = report

  if (type === "canineDeployment") {
    document.getElementById("canineDeploymentGenerator").style.display = "block"
    document.getElementById("cdDate").value = data.date
    document.getElementById("cdTime").value = data.time
    document.getElementById("cdLocation").value = data.location || ""
    document.getElementById("cdSearchType").value = data.searchType || ""
    document.getElementById("cdPositiveAlert").value = data.positiveAlert || ""
    document.getElementById("cdItemsLocated").value = data.itemsLocated || ""
    document.getElementById("cdNarrative").value = data.narrative || ""
    document.getElementById("cdBBCodeOutput").value = data.bbcode || ""
  } else if (type === "canineBite") {
    document.getElementById("canineBiteGenerator").style.display = "block"
    document.getElementById("cbDate").value = data.date
    document.getElementById("cbTime").value = data.time
    document.getElementById("cbNameOfBitten").value = data.nameOfBitten || ""
    document.getElementById("cbExtentOfInjuries").value = data.extentOfInjuries || ""
    document.getElementById("cbFDAttendance").value = data.fdAttendance || ""
    document.getElementById("cbOtherOfficers").value = data.otherOfficers || ""
    document.getElementById("cbNarrative").value = data.narrative || ""
    document.getElementById("cbBBCodeOutput").value = data.bbcode || ""
  } else if (type === "canineSearch") {
    document.getElementById("canineSearchGenerator").style.display = "block"
    document.getElementById("csIncidentCommander").value = data.incidentCommander || ""
    document.getElementById("csLocation").value = data.location || ""
    document.getElementById("csTeamLeader").value = data.teamLeader || ""
    document.getElementById("csCanineHandlers").value = data.canineHandlers || ""
    document.getElementById("csDeploymentType").value = data.deploymentType || ""
    document.getElementById("csDate").value = data.date
    document.getElementById("csTimeStarted").value = data.timeStarted || ""
    document.getElementById("csTimeEnded").value = data.timeEnded || ""
    document.getElementById("csNarrative").value = data.narrative || ""
    document.getElementById("csBBCodeOutput").value = data.bbcode || ""
  } else if (type === "metroDeployment") {
    document.getElementById("metroDeploymentGenerator").style.display = "block"
    document.getElementById("mdDPlatoon").checked = data.dPlatoon || false
    document.getElementById("mdK9Platoon").checked = data.k9Platoon || false
    document.getElementById("mdHPlatoon").checked = data.hPlatoon || false
    document.getElementById("mdBombSquad").checked = data.bombSquad || false
    document.getElementById("mdIncidentCommander").value = data.incidentCommander || ""
    document.getElementById("mdCrisisNegotiator").value = data.crisisNegotiator || ""
    document.getElementById("mdTacticalCommander").value = data.tacticalCommander || ""
    document.getElementById("mdInvolvedMembers").value = data.involvedMembers || ""
    document.getElementById("mdDeploymentType").value = data.deploymentType || ""
    document.getElementById("mdDate").value = data.date
    document.getElementById("mdLocation").value = data.location || ""
    document.getElementById("mdStartTime").value = data.startTime || ""
    document.getElementById("mdEndTime").value = data.endTime || ""
    document.getElementById("mdTimeline").value = data.timeline || ""
    document.getElementById("mdInjuredTeamMembers").value = data.injuredTeamMembers || ""
    document.getElementById("mdSuspectCasualties").value = data.suspectCasualties || ""
    document.getElementById("mdCivilianCasualties").value = data.civilianCasualties || ""
    document.getElementById("mdBBCodeOutput").value = data.bbcode || ""
  } else if (type === "patrolReport") {
    document.getElementById("patrolReportGenerator").style.display = "block"
    document.getElementById("prDate").value = data.date
    document.getElementById("prOfficers").value = data.officers || ""
    document.getElementById("prCaninePatrol").checked = data.caninePatrol || false
    document.getElementById("prSWATPatrol").checked = data.swatPatrol || false
    document.getElementById("prJointPatrol").checked = data.jointPatrol || false
    document.getElementById("prGangPatrol").checked = data.gangPatrol || false
    document.getElementById("prAdditionalInfo").value = data.additionalInfo || ""
    document.getElementById("prBBCodeOutput").value = data.bbcode || ""

    const deploymentsContainer = document.getElementById("prDeploymentsContainer")
    if (deploymentsContainer && data.deployments && Array.isArray(data.deployments)) {
      deploymentsContainer.innerHTML = ""

      if (data.deployments.length === 0) {
        data.deployments = [{ type: "", url: "" }]
      }

      data.deployments.forEach((deployment, index) => {
        const entry = document.createElement("div")
        entry.className = "deployment-entry"
        entry.setAttribute("data-index", index)
        entry.innerHTML = `
          <input type="text" class="deployment-type-input" placeholder="Start typing deployment type..." list="prDeploymentTypesList" value="${deployment.type || ""}" />
          <input type="url" class="deployment-url-input" placeholder="https://forums.example.com/post" value="${deployment.url || ""}" />
          <button type="button" class="remove-deployment-btn" style="display: ${data.deployments.length > 1 ? "flex" : "none"};">×</button>
        `
        deploymentsContainer.appendChild(entry)

        const removeBtn = entry.querySelector(".remove-deployment-btn")
        removeBtn?.addEventListener("click", () => {
          entry.remove()
          updateRemoveButtonsInLoad()
        })
      })
    }
  }

  // Scroll to the loaded form
  setTimeout(() => {
    const activeGenerator = document.querySelector('[id$="Generator"][style*="block"]')
    if (activeGenerator) {
      activeGenerator.scrollIntoView({ behavior: "smooth" })
    }
  }, 100)
}

function updateRemoveButtonsInLoad() {
  const container = document.getElementById("prDeploymentsContainer")
  const entries = container?.querySelectorAll(".deployment-entry")

  entries?.forEach((entry) => {
    const removeBtn = entry.querySelector(".remove-deployment-btn")
    if (entries.length > 1) {
      removeBtn.style.display = "flex"
    } else {
      removeBtn.style.display = "none"
    }
  })
}

export function deleteReport(title) {
  const savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  const filtered = savedReports.filter((r) => r.title !== title)
  localStorage.setItem("savedReports", JSON.stringify(filtered))
  loadSavedReports()
}
