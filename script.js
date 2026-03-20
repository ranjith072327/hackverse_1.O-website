const membersCount = document.getElementById("membersCount");
const member3Block = document.getElementById("member3Block");
const member4Block = document.getElementById("member4Block");
const form = document.getElementById("hackathonForm");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");
const successCard = document.getElementById("successCard");
const applicationIdText = document.getElementById("applicationIdText");
const pdfLinkBtn = document.getElementById("pdfLinkBtn");
const calculatedFee = document.getElementById("calculatedFee");
const calculatedFeeValue = document.getElementById("calculatedFeeValue");

// Paste your deployed Apps Script /exec URL here
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwDy3JyHjEZuo8ViOn9ZMKvpukIoXZdyNRtdgWKPkmm2dQdbyB88FlXNpbR_Kwu-5D/exec";

membersCount.addEventListener("change", handleTeamSizeChange);

function handleTeamSizeChange() {
  toggleMemberBlocks();
  updateFeeDisplay();
}

function updateFeeDisplay() {
  const count = Number(membersCount.value || 0);
  let fee = 0;

  if (count === 2) fee = 600;
  if (count === 3) fee = 750;
  if (count === 4) fee = 900;

  calculatedFee.textContent = `₹${fee}`;
  calculatedFeeValue.value = fee ? String(fee) : "";
}

function toggleMemberBlocks() {
  const count = Number(membersCount.value || 0);

  if (count >= 3) {
    member3Block.classList.remove("hidden");
    setMember3Required(true);
  } else {
    member3Block.classList.add("hidden");
    clearMember3Fields();
    setMember3Required(false);
  }

  if (count === 4) {
    member4Block.classList.remove("hidden");
    setMember4Required(true);
  } else {
    member4Block.classList.add("hidden");
    clearMember4Fields();
    setMember4Required(false);
  }
}

function setMember3Required(isRequired) {
  ["member3Name", "member3College", "member3Department", "member3Email", "member3Whatsapp", "member3Year"]
    .forEach((id) => {
      document.getElementById(id).required = isRequired;
    });
}

function setMember4Required(isRequired) {
  ["member4Name", "member4College", "member4Department", "member4Email", "member4Whatsapp", "member4Year"]
    .forEach((id) => {
      document.getElementById(id).required = isRequired;
    });
}

function clearMember3Fields() {
  ["member3Name", "member3College", "member3Department", "member3Email", "member3Whatsapp", "member3Year"]
    .forEach((id) => {
      document.getElementById(id).value = "";
    });
}

function clearMember4Fields() {
  ["member4Name", "member4College", "member4Department", "member4Email", "member4Whatsapp", "member4Year"]
    .forEach((id) => {
      document.getElementById(id).value = "";
    });
}

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status";
  if (type) statusMessage.classList.add(type);
}

function validateFile(file) {
  if (!file) return "Please upload the payment screenshot.";

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf"
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
  const maxSize = 10 * 1024 * 1024;

  if (!(allowedTypes.includes(file.type) || hasValidExtension)) {
    return "Only JPG, JPEG, PNG, WEBP, or PDF files are allowed.";
  }

  if (file.size > maxSize) {
    return "File size must be less than 10 MB.";
  }

  return "";
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(String(reader.result).split(",")[1]);
      } catch (error) {
        reject(new Error("Could not process the selected file."));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsDataURL(file);
  });
}

function collectFormData(file, base64File) {
  return {
    teamName: document.getElementById("teamName").value.trim(),
    membersCount: document.getElementById("membersCount").value,
    calculatedFee: calculatedFeeValue.value,

    leaderName: document.getElementById("leaderName").value.trim(),
    leaderCollege: document.getElementById("leaderCollege").value.trim(),
    leaderDepartment: document.getElementById("leaderDepartment").value.trim(),
    leaderEmail: document.getElementById("leaderEmail").value.trim(),
    leaderWhatsapp: document.getElementById("leaderWhatsapp").value.trim(),
    leaderYear: document.getElementById("leaderYear").value,

    member2Name: document.getElementById("member2Name").value.trim(),
    member2College: document.getElementById("member2College").value.trim(),
    member2Department: document.getElementById("member2Department").value.trim(),
    member2Email: document.getElementById("member2Email").value.trim(),
    member2Whatsapp: document.getElementById("member2Whatsapp").value.trim(),
    member2Year: document.getElementById("member2Year").value,

    member3Name: document.getElementById("member3Name").value.trim(),
    member3College: document.getElementById("member3College").value.trim(),
    member3Department: document.getElementById("member3Department").value.trim(),
    member3Email: document.getElementById("member3Email").value.trim(),
    member3Whatsapp: document.getElementById("member3Whatsapp").value.trim(),
    member3Year: document.getElementById("member3Year").value,

    member4Name: document.getElementById("member4Name").value.trim(),
    member4College: document.getElementById("member4College").value.trim(),
    member4Department: document.getElementById("member4Department").value.trim(),
    member4Email: document.getElementById("member4Email").value.trim(),
    member4Whatsapp: document.getElementById("member4Whatsapp").value.trim(),
    member4Year: document.getElementById("member4Year").value,

    transactionId: document.getElementById("transactionId").value.trim(),
    specialRequirements: document.getElementById("specialRequirements").value.trim(),
    declaration: document.getElementById("declaration").checked ? "Yes" : "No",

    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    fileData: base64File
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  successCard.classList.add("hidden");

  if (SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    setStatus("Please paste your Google Apps Script Web App URL in script.js first.", "error");
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!calculatedFeeValue.value) {
    setStatus("Please select the team size to calculate the fee.", "error");
    return;
  }

  const file = document.getElementById("paymentScreenshot").files[0];
  const fileError = validateFile(file);
  if (fileError) {
    setStatus(fileError, "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  setStatus("Submitting application, generating ID, PDF, and email...", "loading");

  try {
    const base64File = await readFileAsBase64(file);
    const payload = collectFormData(file, base64File);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    const resultText = await response.text();
    const result = JSON.parse(resultText);

    if (result.status === "success") {
      setStatus(`Application submitted successfully. Your Application ID is ${result.applicationId}.`, "success");

      applicationIdText.textContent = result.applicationId || "";
      pdfLinkBtn.href = result.pdfUrl || "#";
      successCard.classList.remove("hidden");

      form.reset();
      member3Block.classList.add("hidden");
      member4Block.classList.add("hidden");
      setMember3Required(false);
      setMember4Required(false);
      updateFeeDisplay();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStatus(result.message || "Submission failed. Please try again.", "error");
    }
  } catch (error) {
    console.error(error);
    setStatus(error.message || "An error occurred while submitting the form.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Registration";
  }
});

// Initial state
toggleMemberBlocks();
updateFeeDisplay();