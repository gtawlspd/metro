const AUTOSAVE_INTERVAL = 500 // Save after 500ms of inactivity
const UNDO_STACK_SIZE = 50 // Keep last 50 states

const undoStacks = {}
const redoStacks = {}
const autosaveTimers = {}

export function initializeAutosave(formType, formElement) {
  if (!undoStacks[formType]) {
    undoStacks[formType] = []
    redoStacks[formType] = []
  }

  // Set up auto-save on input changes
  const inputs = formElement.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      scheduleAutosave(formType, formElement)
    })
    input.addEventListener("change", () => {
      scheduleAutosave(formType, formElement)
    })
  })

  checkAndPromptRestore(formType)
}

function scheduleAutosave(formType, formElement) {
  if (autosaveTimers[formType]) {
    clearTimeout(autosaveTimers[formType])
  }

  autosaveTimers[formType] = setTimeout(() => {
    saveFormState(formType, formElement)
  }, AUTOSAVE_INTERVAL)
}

function saveFormState(formType, formElement) {
  const formData = {}
  const inputs = formElement.querySelectorAll("input, textarea, select")

  inputs.forEach((input) => {
    if (input.type === "checkbox") {
      formData[input.id] = input.checked
    } else {
      formData[input.id] = input.value
    }
  })

  localStorage.setItem(`autosave_${formType}`, JSON.stringify(formData))
}

export function checkAndPromptRestore(formType) {
  const saved = localStorage.getItem(`autosave_${formType}`)
  if (saved) {
    const restore = confirm("Found auto-saved data. Would you like to restore it?")
    if (restore) {
      restoreFormState(formType)
    } else {
      clearAutoSave(formType)
    }
  }
}

function restoreFormState(formType) {
  const saved = localStorage.getItem(`autosave_${formType}`)
  if (!saved) return

  const formData = JSON.parse(saved)

  Object.keys(formData).forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      if (input.type === "checkbox") {
        input.checked = formData[id]
      } else {
        input.value = formData[id]
      }
    }
  })
}

export function clearAutoSave(formType) {
  localStorage.removeItem(`autosave_${formType}`)
  if (autosaveTimers[formType]) {
    clearTimeout(autosaveTimers[formType])
  }
}

export function markFormAsCleared(formType) {
  undoStacks[formType] = []
  redoStacks[formType] = []
  clearAutoSave(formType)
}

export function undo(formType) {
  if (undoStacks[formType] && undoStacks[formType].length > 0) {
    const currentState = captureFormState(formType)
    const previousState = undoStacks[formType].pop()

    if (!redoStacks[formType]) {
      redoStacks[formType] = []
    }
    redoStacks[formType].push(currentState)

    restoreFormStateFromObject(formType, previousState)
  }
}

export function redo(formType) {
  if (redoStacks[formType] && redoStacks[formType].length > 0) {
    const currentState = captureFormState(formType)
    const nextState = redoStacks[formType].pop()

    undoStacks[formType].push(currentState)
    restoreFormStateFromObject(formType, nextState)
  }
}

function captureFormState(formType) {
  const formData = {}
  const formElement = getFormElement(formType)

  if (formElement) {
    const inputs = formElement.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        formData[input.id] = input.checked
      } else {
        formData[input.id] = input.value
      }
    })
  }

  return formData
}

function restoreFormStateFromObject(formType, formData) {
  Object.keys(formData).forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      if (input.type === "checkbox") {
        input.checked = formData[id]
      } else {
        input.value = formData[id]
      }
    }
  })
}

function getFormElement(formType) {
  const formMap = {
    canineDeployment: "canineDeploymentForm",
    canineBite: "canineBiteForm",
    canineSearch: "canineSearchForm",
    metroDeployment: "metroDeploymentForm",
    patrolReport: "patrolReportForm",
  }

  return document.getElementById(formMap[formType])
}
