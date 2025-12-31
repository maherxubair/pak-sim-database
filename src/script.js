window.jsPDF = window.jspdf.jsPDF;

function showNotification(title, message, type = "error", duration = 6000) {
  const notification = document.getElementById("notification");
  const notificationTitle = document.getElementById("notification-title");
  const notificationMessage = document.getElementById("notification-message");

  notificationTitle.textContent = title;
  notificationMessage.textContent = message;

  notification.className = "notification hidden bg-dark-800 text-gray-200 p-4 rounded-lg shadow-lg";
  if (type === "error") {
    notification.classList.add("border-l-4", "border-red-500");
    notification.querySelector("i").className = "fas fa-exclamation-circle text-red-400 text-xl";
  } else if (type === "success") {
    notification.classList.add("border-l-4", "border-green-500");
    notification.querySelector("i").className = "fas fa-check-circle text-green-400 text-xl";
  }

  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(hideNotification, duration);
}

function hideNotification() {
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 300);
}

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  mobileMenu.classList.toggle("active");
  mobileMenuButton.innerHTML = mobileMenu.classList.contains("hidden") ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
});

const faqButtons = document.querySelectorAll(".faq-btn");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const icon = button.querySelector(".fa-chevron-down");

    document.querySelectorAll(".faq-content").forEach((item) => {
      if (item !== content && !item.classList.contains("hidden")) {
        item.classList.add("hidden");
        item.previousElementSibling.querySelector(".fa-chevron-down").classList.remove("rotate-180");
      }
    });

    content.classList.toggle("hidden");
    icon.classList.toggle("rotate-180");
  });
});

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const resultsList = document.getElementById("resultsList");

let searchResults = null;
let searchQuery = "";

searchBtn.addEventListener("click", async () => {
  const searchValue = searchInput.value.trim();

  resultsList.innerHTML = "";
  resultsContainer.classList.add("hidden");

  let query = searchValue;
  let isSim = false;
  let isCnic = false;

  if (searchValue.length === 11 && searchValue.startsWith("0")) {
    isSim = true;
    query = searchValue.substring(1);
  } else if (searchValue.length === 10 && !isNaN(searchValue)) {
    isSim = true;
  } else if (searchValue.length === 13 && !isNaN(searchValue)) {
    isCnic = true;
  } else {
    showNotification("Invalid Input", "Please provide a valid 10/11-digit SIM or 13-digit CNIC number.");
    return;
  }

  searchQuery = searchValue;

  const originalBtnText = searchBtn.innerHTML;
  searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Searching...';
  searchBtn.disabled = true;

  const paid_api_key = "49d32e2308c704f3fa";
  const free_api_key = "free_key@maher_apis";
  const whatsapp_contact_link = "https://api.whatsapp.com/send/?phone=92&text=Hi+Maher+Zubair+Bro,+I+Want+VIP+API+Access+For+SIM+Database.&type=phone_number";

  try {
    let response = await fetch(`https://api.nexoracle.com/details/pak-sim-database?apikey=${paid_api_key}&q=${query}`);
    let data = await response.json();

    if (response.status === 402 || data.result === "Access Not Allowed. Please Contact Owner.") {
      showNotification("Paid ApiKey Required", "Using Free API Because You Didn't Have Paid ApiKey Access.", "error", 7000);
      response = await fetch(`https://api.nexoracle.com/details/pak-sim-database-free?apikey=${free_api_key}&q=${query}`);
      data = await response.json();
    }

    if (data.result === "No SIM or CNIC data found." || data.result === "No SIM data found.") {
      showNotification("No Details Found", data.result, "error", 6000);

      const noDataItem = document.createElement("div");
      noDataItem.className = "bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden shadow-2xl result-card p-8 text-center";
      noDataItem.innerHTML = `
                  <div class="text-xl text-white-400 mb-4 font-bold">No Detail Records Found in Database</div>
                  <p class="mb-6">You can get this number details via paid service</p>
                  <a href="${whatsapp_contact_link}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg inline-flex items-center">
                      <i class="fab fa-whatsapp mr-2"></i> Contact on WhatsApp
                  </a>
              `;
      resultsList.appendChild(noDataItem);
      resultsContainer.classList.remove("hidden");
      return;
    }

    if (!data.result || (typeof data.result === "string" && data.result !== "No SIM or CNIC data found." && data.result !== "No SIM data found.")) {
      showNotification("API Error", data.result || "Network error - please try again later");
      return;
    }

    if ((Array.isArray(data.result) && data.result.length === 0) || (typeof data.result === "object" && Object.keys(data.result).length === 0)) {
      showNotification("No Data Found", "No information available for this number");
      return;
    }

    searchResults = data.result;

    if (Array.isArray(data.result) && data.result.length > 0) {
      const pdfButtonContainer = document.createElement("div");
      pdfButtonContainer.className = "flex justify-end mb-4";
      pdfButtonContainer.innerHTML = `
          <button class="pdf-download-btn" onclick="generatePDF()">
            <i class="fas fa-file-pdf mr-2"></i> Save PDF
          </button>
        `;
      resultsList.appendChild(pdfButtonContainer);
    }

    if (Array.isArray(data.result)) {
      data.result.forEach((item, index) => {
        if (item && (item.name || item.number)) {
          const resultItem = document.createElement("div");
          resultItem.className = "bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden shadow-2xl result-card p-8";

          resultItem.innerHTML = `
                        <div class="flex items-center mb-4">
                            <span class="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">Record #${index + 1}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-xl font-bold mb-4 text-blue-400">Owner Information</h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Name:</span>
                                        <span class="font-medium">${item.name || "N/A"}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Number:</span>
                                        <span class="font-medium">${item.number || "N/A"}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">CNIC:</span>
                                        <span class="font-medium">${item.cnic || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold mb-4 text-blue-400">Additional Details</h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Operator:</span>
                                        <span class="font-medium">${item.operator || "N/A"}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Address:</span>
                                        <span class="font-medium text-right">${item.address || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
          resultsList.appendChild(resultItem);
        }
      });
    } else if (typeof data.result === "object" && (data.result.name || data.result.number)) {
      const pdfButtonContainer = document.createElement("div");
      pdfButtonContainer.className = "flex justify-end mb-4";
      pdfButtonContainer.innerHTML = `
          <button class="pdf-download-btn" onclick="generatePDF()">
            <i class="fas fa-file-pdf mr-2"></i> Save PDF
          </button>
        `;
      resultsList.appendChild(pdfButtonContainer);

      const resultItem = document.createElement("div");
      resultItem.className = "bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden shadow-2xl result-card p-8";

      resultItem.innerHTML = `
                <div class="flex items-center mb-4">
                    <span class="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">Record #1</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-blue-400">Owner Information</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Name:</span>
                                <span class="font-medium">${data.result.name || "N/A"}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Number:</span>
                                <span class="font-medium">${data.result.number || "N/A"}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">CNIC:</span>
                                <span class="font-medium">${data.result.cnic || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-blue-400">Additional Details</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Operator:</span>
                                <span class="font-medium">${data.result.operator || "N/A"}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Address:</span>
                                <span class="font-medium text-right">${data.result.address || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      resultsList.appendChild(resultItem);

      searchResults = [data.result];
    } else {
      showNotification("Network Error", "Network error - please try again later");
      return;
    }

    if (resultsList.children.length > 0) {
      resultsContainer.classList.remove("hidden");
      document.getElementById("results").scrollIntoView({ behavior: "smooth" });
    } else {
      showNotification("No Data Found", "No valid information available for this number", "error", 7000);
    }
  } catch (error) {
    console.error("failed to get sim details:", error);
    showNotification("Network Error", "Network error - please try again later");
  } finally {
    searchBtn.innerHTML = originalBtnText;
    searchBtn.disabled = false;
  }
});

function generatePDF() {
  if (!searchResults || searchResults.length === 0) {
    showNotification("No Data", "No search results to download", "error");
    return;
  }

  try {
    const doc = new jsPDF();
    let title;

    if (searchQuery.length === 13) {
      title = `CNIC Details for ${searchQuery}`;
    } else {
      `SIM Details for ${searchQuery}`;
    }

    doc.setProperties({
      title,
      subject: "SIM Database Search Results",
      author: "Maher Zubair",
      keywords: "sim, database, pakistan, cnic, number",
      creator: "NexOracle",
    });

    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 220, 30, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Pak SIM Database", 105, 18, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text("pak-sim-data.vercel.app", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Search Query:", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`${searchQuery}`, 50, 45);

    doc.setFont("helvetica", "bold");
    doc.text("Generated on:", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date().toLocaleString()}`, 50, 52);

    let yPosition = 70;

    searchResults.forEach((result, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFillColor(59, 130, 246);
      doc.rect(14, yPosition, 182, 10, "F");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(`Record #${index + 1}`, 20, yPosition + 7);

      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(59, 130, 246);
      doc.setFont("helvetica", "bold");
      doc.text("Owner Information", 20, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      doc.text("Name:", 20, yPosition);
      doc.text(result.name || "N/A", 60, yPosition);
      yPosition += 6;

      doc.text("Number:", 20, yPosition);
      doc.text(result.number || "N/A", 60, yPosition);
      yPosition += 6;

      doc.text("CNIC:", 20, yPosition);
      doc.text(result.cnic || "N/A", 60, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(59, 130, 246);
      doc.setFont("helvetica", "bold");
      doc.text("Additional Details", 20, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      doc.text("Operator:", 20, yPosition);
      doc.text(result.operator || "N/A", 60, yPosition);
      yPosition += 6;

      doc.text("Address:", 20, yPosition);
      const addressLines = doc.splitTextToSize(result.address || "N/A", 120);
      doc.text(addressLines, 60, yPosition);
      yPosition += addressLines.length * 6 + 10;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");

      const fullText = "Designed and developed by NexOracle";
      const textWidth = doc.getTextWidth(fullText);

      const xPosition = 105 - textWidth / 2;

      doc.setTextColor(100, 100, 100);
      doc.text("Designed and developed by ", xPosition, 290);

      const nexOracleX = xPosition + doc.getTextWidth("Designed and developed by ");
      doc.setTextColor(59, 130, 246);
      doc.textWithLink("NexOracle", nexOracleX, 290, { url: "https://nexoracle.com" });
    }

    let fileName;
    if (searchQuery.length === 13) {
      fileName = `${searchQuery}-cnic-details.pdf`;
    } else {
      fileName = `${searchQuery}-sim-details.pdf`;
    }

    doc.save(fileName);

    showNotification("PDF Downloaded", `Details saved as ${fileName}`, "success");
  } catch (error) {
    console.error("Error generating PDF:", error);
    showNotification("PDF Error", "Failed to generate PDF. Please try again.", "error");
  }
}

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("active");
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

ScrollReveal().reveal(".animate-fade-in", {
  delay: 200,
  duration: 1000,
  opacity: 0,
  easing: "ease-in-out",
});

ScrollReveal().reveal(".animate-slide-up", {
  delay: 300,
  duration: 800,
  distance: "30px",
  origin: "bottom",
  easing: "ease-out",
});
