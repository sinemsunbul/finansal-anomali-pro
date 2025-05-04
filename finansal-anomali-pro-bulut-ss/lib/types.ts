export interface Account {
  isim: string
  hesap_numarasi: string
  transfer_tutari: number
  transfer_saati: string
  gelir: number
  hesap_turu: string
  "kara listede hesap": string
  "Yurt dışı transfer büyüklüğü": string
  "Ters İbraz Oranı": string
  "Kredi Kartı Harcama": string
  "Hesap Bakiyesi": string
  puan: number
}

export interface FilterOptions {
  isimArama: string
  hesapTuru: string
  kucukTutarTransfer: boolean
  suphelihesaplar: boolean
  geceTransfer: boolean
  karaListe: boolean
  yurtdisiTransfer: boolean
  yurtdisiGelir: boolean
  tersIbraz: boolean
  kkBakiye: boolean
}
