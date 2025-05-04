// DOM elementlerini seç
const filterButton = document.getElementById("filterButton")
const highScoreButton = document.getElementById("highScoreButton")
const resultsContainer = document.getElementById("results")

// Checkbox elementleri
const kucukTutarCheckbox = document.getElementById("kucukTutar")
const supheliCheckbox = document.getElementById("supheli")
const geceCheckbox = document.getElementById("gece")
const karaListeCheckbox = document.getElementById("karaListe")
const yurtdisiTransferCheckbox = document.getElementById("yurtdisiTransfer")
const yurtdisiGelirCheckbox = document.getElementById("yurtdisiGelir")
const tersIbrazCheckbox = document.getElementById("tersIbraz")
const kkBakiyeCheckbox = document.getElementById("kkBakiye")

// Input ve select elementleri
const isimAraInput = document.getElementById("isimAra")
const hesapTuruSelect = document.getElementById("hesapTuru")

// Sayfa yüklendiğinde verileri al
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Verileri main process'ten al
    const data = await window.electronAPI.getData()
    console.log("Veriler başarıyla alındı:", data)
  } catch (error) {
    console.error("Veri alınırken hata oluştu:", error)
  }
})

// Filtrele butonuna tıklandığında
filterButton.addEventListener("click", async () => {
  try {
    // Filtre seçeneklerini topla
    const filters = {
      isimArama: isimAraInput.value,
      hesapTuru: hesapTuruSelect.value,
      kucukTutarTransfer: kucukTutarCheckbox.checked,
      suphelihesaplar: supheliCheckbox.checked,
      geceTransfer: geceCheckbox.checked,
      karaListe: karaListeCheckbox.checked,
      yurtdisiTransfer: yurtdisiTransferCheckbox.checked,
      yurtdisiGelir: yurtdisiGelirCheckbox.checked,
      tersIbraz: tersIbrazCheckbox.checked,
      kkBakiye: kkBakiyeCheckbox.checked,
    }

    // Filtrelenmiş verileri al
    const filteredData = await window.electronAPI.filterData(filters)

    // Sonuçları göster
    displayResults(filteredData)
  } catch (error) {
    console.error("Filtreleme sırasında hata oluştu:", error)
  }
})

// Yüksek puan filtrele butonuna tıklandığında
highScoreButton.addEventListener("click", async () => {
  try {
    // Yüksek puanlı verileri al
    const highScoreData = await window.electronAPI.filterHighScore()

    // Sonuçları göster
    displayResults(highScoreData)
  } catch (error) {
    console.error("Yüksek puan filtreleme sırasında hata oluştu:", error)
  }
})

// Sonuçları gösterme fonksiyonu
function displayResults(data) {
  // Sonuç container'ını temizle
  resultsContainer.innerHTML = ""

  if (data.length === 0) {
    // Sonuç yoksa mesaj göster
    const noResultsElement = document.createElement("p")
    noResultsElement.className = "no-results"
    noResultsElement.textContent = "Hiçbir sonuç bulunamadı."
    resultsContainer.appendChild(noResultsElement)
  } else {
    // Sonuçları listele
    data.forEach((item) => {
      const resultElement = document.createElement("div")
      resultElement.className = "result-item"
      resultElement.textContent = `${item.isim} - Hesap No: ${item.hesap_numarasi} - Puan: ${item.puan}`
      resultsContainer.appendChild(resultElement)
    })
  }
}
