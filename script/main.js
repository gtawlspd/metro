import { generateCanineDeploymentBBCode } from "./generators/canine-deployment.js"
import { generateCanineBiteBBCode } from "./generators/canine-bite.js"
import { generateCanineSearchBBCode } from "./generators/canine-search.js"
import { generateMetroDeploymentBBCode } from "./generators/metro-deployment.js"
import { generatePatrolReportBBCode } from "./generators/patrol-report.js"
import { hideAllSections, populateStaticHandlerInfo, setupDropdowns } from "./utils/ui.js"
import { loadSavedReports } from "./utils/localstorage.js"
import { loadDeploymentTypes } from "./utils/deployment-types.js"
import { checkAndPromptRestore, clearAutoSave, initializeAutosave, markFormAsCleared } from "./utils/autosave.js"

function updateGMTClock() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, "0")
  const minutes = String(now.getUTCMinutes()).padStart(2, "0")
  const seconds = String(now.getUTCSeconds()).padStart(2, "0")

  const clockElement = document.getElementById("gmtClock")
  if (clockElement) {
    clockElement.textContent = `${hours}:${minutes}:${seconds}`
  }
}

updateGMTClock()
setInterval(updateGMTClock, 1000)

const setTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatDateForBBCode(dateStr) {
  const date = new Date(dateStr)
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const day = String(date.getDate()).padStart(2, "0")
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function calculateK9Number(badgeNumber) {
  if (!badgeNumber) return ""
  const badgeStr = badgeNumber.toString()
  const lastThree = badgeStr.slice(-3).padStart(3, "0")
  return lastThree
}

function getPlatoonDisplayName(platoon) {
  if (platoon === "D Platoon") return "SWAT"
  if (platoon === "K9 Platoon") return "K9"
  if (platoon === "H Platoon") return "H Platoon"
  if (platoon === "Bomb Squad") return "Bomb Squad"
  return platoon
}

window.addEventListener("DOMContentLoaded", () => {
  setupDropdowns()
  loadSavedReports()
  loadDeploymentTypes()
  populateStaticHandlerInfo()
  initializeSettingsToggle()

  document.getElementById("canineDeploymentButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("cdDate").value = setTodayDate()
    document.getElementById("canineDeploymentGenerator").style.display = "block"
    document.getElementById("canineDeploymentGenerator").scrollIntoView({ behavior: "smooth" })
    initializeAutosave("canineDeployment", document.getElementById("canineDeploymentForm"))
    checkAndPromptRestore("canineDeployment")
  })

  document.getElementById("canineBiteButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("cbDate").value = setTodayDate()
    document.getElementById("canineBiteGenerator").style.display = "block"
    document.getElementById("canineBiteGenerator").scrollIntoView({ behavior: "smooth" })
    initializeAutosave("canineBite", document.getElementById("canineBiteForm"))
    checkAndPromptRestore("canineBite")
  })

  document.getElementById("canineSearchButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("csDate").value = setTodayDate()
    document.getElementById("canineSearchGenerator").style.display = "block"
    document.getElementById("canineSearchGenerator").scrollIntoView({ behavior: "smooth" })
    initializeAutosave("canineSearch", document.getElementById("canineSearchForm"))
    checkAndPromptRestore("canineSearch")
  })

  document.getElementById("metroDeploymentButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("mdDate").value = setTodayDate()

    const platoon = localStorage.getItem("platoon") || ""
    const handlerName = localStorage.getItem("handlerName") || ""
    const rank = localStorage.getItem("divisionalRank") || ""

    if (platoon === "K9 Platoon") {
      document.getElementById("mdK9Platoon").checked = true
    } else if (platoon === "D Platoon") {
      document.getElementById("mdDPlatoon").checked = true
    } else if (platoon === "H Platoon") {
      document.getElementById("mdHPlatoon").checked = true
    } else if (platoon === "Bomb Squad") {
      document.getElementById("mdBombSquad").checked = true
    }

    const involvedMembersField = document.getElementById("mdInvolvedMembers")
    if (handlerName && rank && platoon) {
      const displayPlatoon = getPlatoonDisplayName(platoon)
      const userEntry = `${displayPlatoon} ${rank} ${handlerName}`
      if (!involvedMembersField.value.includes(handlerName)) {
        involvedMembersField.value = userEntry + (involvedMembersField.value ? "\n" + involvedMembersField.value : "")
      }
    }

    document.getElementById("metroDeploymentGenerator").style.display = "block"
    document.getElementById("metroDeploymentGenerator").scrollIntoView({ behavior: "smooth" })
    initializeAutosave("metroDeployment", document.getElementById("metroDeploymentForm"))
    checkAndPromptRestore("metroDeployment")
  })

  document.getElementById("patrolReportButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("prDate").value = setTodayDate()

    const platoon = localStorage.getItem("platoon") || ""
    const handlerName = localStorage.getItem("handlerName") || ""
    const rank = localStorage.getItem("divisionalRank") || ""

    if (platoon === "K9 Platoon") {
      document.getElementById("prCaninePatrol").checked = true
    } else if (platoon === "D Platoon") {
      document.getElementById("prSWATPatrol").checked = true
    }

    const patrolCheckboxes = ["prCaninePatrol", "prSWATPatrol", "prJointPatrol", "prGangPatrol"]
    patrolCheckboxes.forEach((checkboxId) => {
      const checkbox = document.getElementById(checkboxId)
      checkbox?.addEventListener("change", (e) => {
        if (e.target.checked) {
          patrolCheckboxes.forEach((id) => {
            if (id !== checkboxId) {
              document.getElementById(id).checked = false
            }
          })
        }
      })
    })

    const officersField = document.getElementById("prOfficers")
    if (handlerName && rank && platoon) {
      const displayPlatoon = getPlatoonDisplayName(platoon)
      const userEntry = `${displayPlatoon} ${rank} ${handlerName}`
      if (!officersField.value.includes(handlerName)) {
        officersField.value = userEntry + (officersField.value ? "\n" + officersField.value : "")
      }
    }

    initializeDeploymentEntries()

    document.getElementById("patrolReportGenerator").style.display = "block"
    document.getElementById("patrolReportGenerator").scrollIntoView({ behavior: "smooth" })
    initializeAutosave("patrolReport", document.getElementById("patrolReportForm"))
    checkAndPromptRestore("patrolReport")
  })

  document.getElementById("canineDeploymentBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("canineBiteBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("canineSearchBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("metroDeploymentBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("patrolReportBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("generateCanineDeployment")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineDeploymentBBCode()
    document.getElementById("cdBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
    clearAutoSave("canineDeployment")
  })

  document.getElementById("generateCanineBite")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineBiteBBCode()
    document.getElementById("cbBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
    clearAutoSave("canineBite")
  })

  document.getElementById("generateCanineSearch")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineSearchBBCode()
    document.getElementById("csBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
    clearAutoSave("canineSearch")
  })

  document.getElementById("generateMetroDeployment")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateMetroDeploymentBBCode()
    document.getElementById("mdBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
    clearAutoSave("metroDeployment")
  })

  document.getElementById("generatePatrolReport")?.addEventListener("click", (e) => {
    e.preventDefault()
    generatePatrolReportBBCode()
    document.getElementById("prBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
    clearAutoSave("patrolReport")
  })

  document.getElementById("newCanineDeployment")?.addEventListener("click", () => {
    document.getElementById("canineDeploymentForm").reset()
    document.getElementById("cdDate").value = setTodayDate()
    markFormAsCleared("canineDeployment")
  })

  document.getElementById("newCanineBite")?.addEventListener("click", () => {
    document.getElementById("canineBiteForm").reset()
    document.getElementById("cbDate").value = setTodayDate()
    markFormAsCleared("canineBite")
  })

  document.getElementById("newCanineSearch")?.addEventListener("click", () => {
    document.getElementById("canineSearchForm").reset()
    document.getElementById("csDate").value = setTodayDate()
    markFormAsCleared("canineSearch")
  })

  document.getElementById("newMetroDeployment")?.addEventListener("click", () => {
    document.getElementById("metroDeploymentForm").reset()
    document.getElementById("mdDate").value = setTodayDate()
    markFormAsCleared("metroDeployment")
  })

  document.getElementById("newPatrolReport")?.addEventListener("click", () => {
    document.getElementById("patrolReportForm").reset()
    document.getElementById("prDate").value = setTodayDate()
    markFormAsCleared("patrolReport")
  })

  document.getElementById("formButton")?.addEventListener("click", handleSidebarSaveEdit)
})

function initializeSettingsToggle() {
  const settingsToggleBtn = document.getElementById("settingsToggleBtn")
  const settingsSection = document.querySelector(".settings-section")
  const sidebar = document.getElementById("sidebar")
  const body = document.body

  settingsToggleBtn?.addEventListener("click", () => {
    const isCollapsed = settingsSection.classList.contains("collapsed")

    if (isCollapsed) {
      // Expand settings
      settingsSection.classList.remove("collapsed")
    } else {
      // Collapse settings
      settingsSection.classList.add("collapsed")
    }
  })
}

export function handleSidebarSaveEdit(e) {
  e.preventDefault()
  const form = document.getElementById("officerForm")
  const button = document.getElementById("formButton")
  const settingsSection = document.querySelector(".settings-section")

  if (button.textContent === "SUBMIT") {
    const handlerName = document.getElementById("handlerName").value
    const badgeNumber = document.getElementById("badgeNumber").value
    const platoon = document.getElementById("platoon").value
    const k9Name = document.getElementById("k9Name").value
    const k9Specialization = document.getElementById("k9Specialization").value
    const divisionalRank = document.getElementById("divisionalRank").value
    const signatureUrl = document.getElementById("signatureUrl").value

    const k9Number = calculateK9Number(badgeNumber)

    localStorage.setItem("handlerName", handlerName)
    localStorage.setItem("badgeNumber", badgeNumber)
    localStorage.setItem("platoon", platoon)
    localStorage.setItem("k9Name", k9Name)
    localStorage.setItem("k9Number", k9Number)
    localStorage.setItem("k9Specialization", k9Specialization)
    localStorage.setItem("divisionalRank", divisionalRank)

    if (signatureUrl) {
      localStorage.setItem("signatureImage", signatureUrl)
    }

    form.innerHTML = `
      <div id="nameAndSerial">
        <span class="static-text">${handlerName}</span><br>
        <span id="serialNumberStatic" class="static-text">#${badgeNumber}</span><br>
        <span class="static-text">Platoon: ${platoon}</span><br>
        <span class="static-text">K9: ${k9Name} (#${k9Number})</span><br>
        <span class="static-text">${k9Specialization}</span><br>
        <span class="static-text">${divisionalRank}</span>
      </div>
      <button id="formButton" type="submit">EDIT</button>
    `

    setTimeout(() => {
      settingsSection.classList.add("collapsed")
    }, 500)
  } else {
    const handlerName = localStorage.getItem("handlerName") || ""
    const badgeNumber = localStorage.getItem("badgeNumber") || ""
    const platoon = localStorage.getItem("platoon") || ""
    const k9Name = localStorage.getItem("k9Name") || ""
    const k9Specialization = localStorage.getItem("k9Specialization") || ""
    const divisionalRank = localStorage.getItem("divisionalRank") || ""
    const signatureUrl = localStorage.getItem("signatureImage") || ""

    const k9Number = calculateK9Number(badgeNumber)

    form.innerHTML = `
      <div id="nameAndSerial">
        <input id="handlerName" type="text" placeholder="Handler Name" value="${handlerName}" />
        <input id="badgeNumber" type="text" placeholder="Badge Number" value="${badgeNumber}" />
        <select id="platoon" required>
          <option value="">Select Platoon</option>
          <option value="K9 Platoon" ${platoon === "K9 Platoon" ? "selected" : ""}>K9 Platoon</option>
          <option value="D Platoon" ${platoon === "D Platoon" ? "selected" : ""}>D Platoon (SWAT)</option>
          <option value="H Platoon" ${platoon === "H Platoon" ? "selected" : ""}>H Platoon</option>
          <option value="Bomb Squad" ${platoon === "Bomb Squad" ? "selected" : ""}>Bomb Squad</option>
        </select>
        <input id="k9Name" type="text" placeholder="K9 Name (optional)" value="${k9Name}" />
        <input id="k9Number" type="text" placeholder="K9 Number (auto)" value="${k9Number}" readonly />
        <input id="k9Specialization" type="text" placeholder="K9 Specialization (optional)" value="${k9Specialization}" list="k9SpecializationList" />
        <datalist id="k9SpecializationList">
          <option value="FIREARMS">
          <option value="NARCOTICS">
          <option value="EXPLOSIVES">
          <option value="DUAL PURPOSE">
        </datalist>
        <input id="divisionalRank" type="text" placeholder="Divisional Rank" value="${divisionalRank}" />
      </div>
      <label for="signatureUrl" class="signature-label">Signature Image URL (.png)</label>
      <input id="signatureUrl" type="url" placeholder="https://i.imgur.com/example.png" value="${signatureUrl}" />
      <button id="formButton" type="submit">SUBMIT</button>
    `

    setTimeout(() => {
      const badgeInput = document.getElementById("badgeNumber")
      const k9NumberInput = document.getElementById("k9Number")

      badgeInput?.addEventListener("input", (e) => {
        const newK9Number = calculateK9Number(e.target.value)
        if (k9NumberInput) {
          k9NumberInput.value = newK9Number
        }
      })
    }, 0)
  }

  setTimeout(() => {
    document.getElementById("formButton")?.addEventListener("click", handleSidebarSaveEdit)
  }, 0)
}

function initializeDeploymentEntries() {
  const addBtn = document.getElementById("addDeploymentBtn")
  const container = document.getElementById("prDeploymentsContainer")

  addBtn?.addEventListener("click", () => {
    const entries = container.querySelectorAll(".deployment-entry")
    const newIndex = entries.length

    const newEntry = document.createElement("div")
    newEntry.className = "deployment-entry"
    newEntry.setAttribute("data-index", newIndex)
    newEntry.innerHTML = `
      <input type="text" class="deployment-type-input" placeholder="Start typing deployment type..." list="prDeploymentTypesList" />
      <input type="url" class="deployment-url-input" placeholder="https://forums.example.com/post" />
      <button type="button" class="remove-deployment-btn">×</button>
    `

    container.appendChild(newEntry)

    // Add remove button handler
    const removeBtn = newEntry.querySelector(".remove-deployment-btn")
    removeBtn.addEventListener("click", () => {
      newEntry.remove()
      updateRemoveButtons()
    })

    updateRemoveButtons()
  })

  // Initialize remove buttons
  updateRemoveButtons()
}

function updateRemoveButtons() {
  const container = document.getElementById("prDeploymentsContainer")
  const entries = container?.querySelectorAll(".deployment-entry")

  entries?.forEach((entry, index) => {
    const removeBtn = entry.querySelector(".remove-deployment-btn")
    if (entries.length > 1) {
      removeBtn.style.display = "flex"
      if (!removeBtn.hasAttribute("data-listener")) {
        removeBtn.addEventListener("click", () => {
          entry.remove()
          updateRemoveButtons()
        })
        removeBtn.setAttribute("data-listener", "true")
      }
    } else {
      removeBtn.style.display = "none"
    }
  })
}
