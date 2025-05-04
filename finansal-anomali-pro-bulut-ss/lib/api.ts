import type { Account } from "./types"

// Örnek veri kümesi
const mockData = [
  {
    isim: "Ahmet Yılmaz",
    hesap_numarasi: "TR123456789012345678901234",
    transfer_tutari: 50,
    transfer_saati: "2023-10-01 22:00",
    gelir: 2000,
    hesap_turu: "E-cüzdan",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "0",
    "Ters İbraz Oranı": "15",
    "Kredi Kartı Harcama": "1000",
    "Hesap Bakiyesi": "200",
  },
  {
    isim: "Mehmet Demir",
    hesap_numarasi: "TR987654321098765432109876",
    transfer_tutari: 500,
    transfer_saati: "2023-10-01 10:00",
    gelir: 3000,
    hesap_turu: "Bireysel",
    "kara listede hesap": "var",
    "Yurt dışı transfer büyüklüğü": "0",
    "Ters İbraz Oranı": "95",
    "Kredi Kartı Harcama": "1000",
    "Hesap Bakiyesi": "300",
  },
  {
    isim: "Ayşe Kara",
    hesap_numarasi: "TR456789012345678901234567",
    transfer_tutari: 20,
    transfer_saati: "2023-10-01 23:30",
    gelir: 1500,
    hesap_turu: "E-cüzdan",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "5000",
    "Ters İbraz Oranı": "75",
    "Kredi Kartı Harcama": "1000",
    "Hesap Bakiyesi": "400",
  },
  {
    isim: "Fatma Çelik",
    hesap_numarasi: "TR321098765432109876543210",
    transfer_tutari: 1000,
    transfer_saati: "2023-10-02 01:00",
    gelir: 2500,
    hesap_turu: "Kripto",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "1000",
    "Ters İbraz Oranı": "25",
    "Kredi Kartı Harcama": "0",
    "Hesap Bakiyesi": "0",
  },
  {
    isim: "Ali Yılmaz",
    hesap_numarasi: "TR654321098765432109876543",
    transfer_tutari: 5,
    transfer_saati: "2023-10-02 15:00",
    gelir: 1000,
    hesap_turu: "Bireysel",
    "kara listede hesap": "var",
    "Yurt dışı transfer büyüklüğü": "0",
    "Ters İbraz Oranı": "45",
    "Kredi Kartı Harcama": "1000",
    "Hesap Bakiyesi": "1000",
  },
  {
    isim: "Zeynep Aslan",
    hesap_numarasi: "TR001122334455667788990011",
    transfer_tutari: 75,
    transfer_saati: "2023-10-02 22:45",
    gelir: 2200,
    hesap_turu: "E-cüzdan",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "200",
    "Ters İbraz Oranı": "20",
    "Kredi Kartı Harcama": "800",
    "Hesap Bakiyesi": "150",
  },
  {
    isim: "Burak Kaya",
    hesap_numarasi: "TR112233445566778899001122",
    transfer_tutari: 1200,
    transfer_saati: "2023-10-01 03:30",
    gelir: 4000,
    hesap_turu: "Kripto",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "1500",
    "Ters İbraz Oranı": "65",
    "Kredi Kartı Harcama": "0",
    "Hesap Bakiyesi": "0",
  },
  {
    isim: "Elif Öztürk",
    hesap_numarasi: "TR223344556677889900112233",
    transfer_tutari: 35,
    transfer_saati: "2023-10-02 19:15",
    gelir: 1800,
    hesap_turu: "Bireysel",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "0",
    "Ters İbraz Oranı": "10",
    "Kredi Kartı Harcama": "500",
    "Hesap Bakiyesi": "250",
  },
  {
    isim: "Hakan Polat",
    hesap_numarasi: "TR334455667788990011223344",
    transfer_tutari: 900,
    transfer_saati: "2023-10-02 00:30",
    gelir: 3500,
    hesap_turu: "Kripto",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "750",
    "Ters İbraz Oranı": "30",
    "Kredi Kartı Harcama": "0",
    "Hesap Bakiyesi": "50",
  },
  {
    isim: "Merve Güneş",
    hesap_numarasi: "TR445566778899001122334455",
    transfer_tutari: 10,
    transfer_saati: "2023-10-01 21:45",
    gelir: 1200,
    hesap_turu: "E-cüzdan",
    "kara listede hesap": "yok",
    "Yurt dışı transfer büyüklüğü": "100",
    "Ters İbraz Oranı": "5",
    "Kredi Kartı Harcama": "900",
    "Hesap Bakiyesi": "120",
  },
]

// API fonksiyonu - gerçek bir API'ye bağlanacak şekilde değiştirilebilir
export async function fetchAccounts(): Promise<Account[]> {
  // Gerçek bir API çağrısı simülasyonu
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}

// Gelecekte eklenebilecek diğer API fonksiyonları
export async function saveAccount(account: Account): Promise<Account> {
  // Gerçek bir API çağrısı simülasyonu
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(account)
    }, 1000)
  })
}

export async function deleteAccount(accountId: string): Promise<boolean> {
  // Gerçek bir API çağrısı simülasyonu
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
