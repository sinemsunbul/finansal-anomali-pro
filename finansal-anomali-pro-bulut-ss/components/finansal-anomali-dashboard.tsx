"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
  Search,
  RotateCcw,
  Eye,
  FileText,
  FileIcon as FilePdf,
  Printer,
  BarChartIcon as ChartBar,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { fetchAccounts } from "@/lib/api"
import type { Account, FilterOptions } from "@/lib/types"
import { calculateScore, getRiskLevel, isGeceTransfer } from "@/lib/utils"

export default function FinansalAnomaliDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const { toast } = useToast()

  // Filtre durumları
  const [filters, setFilters] = useState<FilterOptions>({
    isimArama: "",
    hesapTuru: "Tümü",
    kucukTutarTransfer: false,
    suphelihesaplar: false,
    geceTransfer: false,
    karaListe: false,
    yurtdisiTransfer: false,
    yurtdisiGelir: false,
    tersIbraz: false,
    kkBakiye: false,
  })

  // İstatistikler
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  })

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts()

        // Hesaplara puan ekle
        const accountsWithScore = data.map((account) => ({
          ...account,
          puan: calculateScore(account),
        }))

        setAccounts(accountsWithScore)
        setFilteredAccounts(accountsWithScore)
        updateStatistics(accountsWithScore)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Veri yükleme hatası",
          description: "Hesap verileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [toast])

  // İstatistikleri güncelle
  const updateStatistics = (accountList: Account[]) => {
    const highRisk = accountList.filter((account) => account.puan >= 9).length
    const mediumRisk = accountList.filter((account) => account.puan >= 6 && account.puan < 9).length
    const lowRisk = accountList.filter((account) => account.puan < 6).length

    setStats({
      total: accountList.length,
      highRisk,
      mediumRisk,
      lowRisk,
    })
  }

  // Filtre değişikliklerini izle
  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Filtreleme işlemi
  const applyFilters = () => {
    setIsLoading(true)

    let filtered = [...accounts]

    // İsim veya hesap numarası araması
    if (filters.isimArama) {
      filtered = filtered.filter(
        (account) =>
          account.isim.toLowerCase().includes(filters.isimArama.toLowerCase()) ||
          account.hesap_numarasi.toLowerCase().includes(filters.isimArama.toLowerCase()),
      )
    }

    // Hesap türü filtresi
    if (filters.hesapTuru !== "Tümü") {
      filtered = filtered.filter((account) => account.hesap_turu === filters.hesapTuru)
    }

    // Diğer filtreler
    if (filters.kucukTutarTransfer) {
      filtered = filtered.filter((account) => account.transfer_tutari < 100)
    }

    if (filters.suphelihesaplar) {
      filtered = filtered.filter((account) => account.hesap_turu === "E-cüzdan" || account.hesap_turu === "Kripto")
    }

    if (filters.geceTransfer) {
      filtered = filtered.filter((account) => isGeceTransfer(account.transfer_saati))
    }

    if (filters.karaListe) {
      filtered = filtered.filter((account) => account["kara listede hesap"] === "var")
    }

    if (filters.yurtdisiTransfer) {
      filtered = filtered.filter((account) => Number.parseInt(account["Yurt dışı transfer büyüklüğü"]) > 2500)
    }

    if (filters.yurtdisiGelir) {
      filtered = filtered.filter((account) => Number.parseInt(account["Yurt dışı transfer büyüklüğü"]) > 0)
    }

    if (filters.tersIbraz) {
      filtered = filtered.filter((account) => Number.parseInt(account["Ters İbraz Oranı"]) > 50)
    }

    if (filters.kkBakiye) {
      filtered = filtered.filter(
        (account) =>
          Number.parseFloat(account["Hesap Bakiyesi"]) + Number.parseFloat(account["Hesap Bakiyesi"]) / 2 <
          Number.parseFloat(account["Kredi Kartı Harcama"]),
      )
    }

    setFilteredAccounts(filtered)
    updateStatistics(filtered)

    toast({
      title: "Filtreler uygulandı",
      description: `${filtered.length} hesap bulundu.`,
    })

    setIsLoading(false)
  }

  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      isimArama: "",
      hesapTuru: "Tümü",
      kucukTutarTransfer: false,
      suphelihesaplar: false,
      geceTransfer: false,
      karaListe: false,
      yurtdisiTransfer: false,
      yurtdisiGelir: false,
      tersIbraz: false,
      kkBakiye: false,
    })

    setFilteredAccounts(accounts)
    updateStatistics(accounts)

    toast({
      title: "Filtreler sıfırlandı",
      description: "Tüm filtreler kaldırıldı.",
    })
  }

  // Yüksek riskli hesapları filtrele
  const filterHighRiskAccounts = () => {
    setIsLoading(true)

    const highRiskAccounts = accounts.filter((account) => account.puan >= 9)

    setFilteredAccounts(highRiskAccounts)
    updateStatistics(highRiskAccounts)

    toast({
      title: "Yüksek riskli hesaplar",
      description: `${highRiskAccounts.length} yüksek riskli hesap bulundu.`,
    })

    setIsLoading(false)
  }

  // Hesap detaylarını göster
  const showAccountDetails = (account: Account) => {
    setSelectedAccount(account)
    setShowDetailModal(true)
  }

  // CSV'ye dışa aktar
  const exportToCSV = () => {
    // CSV başlık satırı
    let csvContent =
      "İsim,Hesap Numarası,Transfer Tutarı,Transfer Saati,Gelir,Hesap Türü,Kara Listede,Yurt Dışı Transfer,Ters İbraz Oranı,Kredi Kartı Harcama,Hesap Bakiyesi,Risk Puanı\n"

    // Veri satırları
    filteredAccounts.forEach((account) => {
      csvContent += `${account.isim},${account.hesap_numarasi},${account.transfer_tutari},${account.transfer_saati},${account.gelir},${account.hesap_turu},${account["kara listede hesap"]},${account["Yurt dışı transfer büyüklüğü"]},${account["Ters İbraz Oranı"]},${account["Kredi Kartı Harcama"]},${account["Hesap Bakiyesi"]},${account.puan}\n`
    })

    // CSV dosyasını oluştur ve indir
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "finansal_anomali_sonuclari.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Dışa aktarma başarılı",
      description: "Veriler CSV formatında indirildi.",
    })
  }

  // Risk dağılımı grafiği için veri hazırla
  const prepareChartData = () => {
    // Risk puanlarını hesapla (0-10)
    const scoreCounts = Array(11).fill(0)

    filteredAccounts.forEach((account) => {
      scoreCounts[account.puan] = (scoreCounts[account.puan] || 0) + 1
    })

    return scoreCounts
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Hesap</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Yüksek Riskli</p>
              <p className="text-3xl font-bold">{stats.highRisk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Orta Riskli</p>
              <p className="text-3xl font-bold">{stats.mediumRisk}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-warning opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Düşük Riskli</p>
              <p className="text-3xl font-bold">{stats.lowRisk}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filtreler */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreleme Seçenekleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Transfer Özellikleri */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-primary">Transfer Özellikleri</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kucukTutar"
                    checked={filters.kucukTutarTransfer}
                    onCheckedChange={(checked) => handleFilterChange("kucukTutarTransfer", !!checked)}
                  />
                  <Label htmlFor="kucukTutar">Küçük Tutar Transferleri</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="geceTransfer"
                    checked={filters.geceTransfer}
                    onCheckedChange={(checked) => handleFilterChange("geceTransfer", !!checked)}
                  />
                  <Label htmlFor="geceTransfer">Gece ve Hafta Sonu Transferleri</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="yurtdisiTransfer"
                    checked={filters.yurtdisiTransfer}
                    onCheckedChange={(checked) => handleFilterChange("yurtdisiTransfer", !!checked)}
                  />
                  <Label htmlFor="yurtdisiTransfer">Yurt Dışı Transfer &gt; 2500</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="yurtdisiGelir"
                    checked={filters.yurtdisiGelir}
                    onCheckedChange={(checked) => handleFilterChange("yurtdisiGelir", !!checked)}
                  />
                  <Label htmlFor="yurtdisiGelir">Yurt Dışı Geliri Olanlar</Label>
                </div>
              </div>

              {/* Hesap Güvenliği */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-primary">Hesap Güvenliği</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="supheli"
                    checked={filters.suphelihesaplar}
                    onCheckedChange={(checked) => handleFilterChange("suphelihesaplar", !!checked)}
                  />
                  <Label htmlFor="supheli">Şüpheli Hesaplar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="karaListe"
                    checked={filters.karaListe}
                    onCheckedChange={(checked) => handleFilterChange("karaListe", !!checked)}
                  />
                  <Label htmlFor="karaListe">Kara Listede Hesap</Label>
                </div>
              </div>

              {/* Finansal Göstergeler */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-primary">Finansal Göstergeler</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tersIbraz"
                    checked={filters.tersIbraz}
                    onCheckedChange={(checked) => handleFilterChange("tersIbraz", !!checked)}
                  />
                  <Label htmlFor="tersIbraz">Ters İbraz Oranı > 50</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kkBakiye"
                    checked={filters.kkBakiye}
                    onCheckedChange={(checked) => handleFilterChange("kkBakiye", !!checked)}
                  />
                  <Label htmlFor="kkBakiye">Kredi Kartı-Hesap Bakiye Oranı</Label>
                </div>
              </div>

              {/* Arama ve Seçim */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="isimAra">İsim veya Hesap No Ara</Label>
                  <Input
                    id="isimAra"
                    value={filters.isimArama}
                    onChange={(e) => handleFilterChange("isimArama", e.target.value)}
                    placeholder="Arama yapın..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hesapTuru">Hesap Türü</Label>
                  <Select value={filters.hesapTuru} onValueChange={(value) => handleFilterChange("hesapTuru", value)}>
                    <SelectTrigger id="hesapTuru">
                      <SelectValue placeholder="Hesap türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tümü">Tümü</SelectItem>
                      <SelectItem value="Bireysel">Bireysel</SelectItem>
                      <SelectItem value="E-cüzdan">E-cüzdan</SelectItem>
                      <SelectItem value="Kripto">Kripto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-col gap-3">
                <Button onClick={applyFilters} disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  Filtrele
                </Button>
                <Button variant="outline" onClick={resetFilters} disabled={isLoading}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Sıfırla
                </Button>
                <Button variant="destructive" onClick={filterHighRiskAccounts} disabled={isLoading}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Yüksek Riskli Hesaplar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sonuçlar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                Anomali Analizi
              </div>
              <Badge variant="outline">{filteredAccounts.length} sonuç</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Tablo</TabsTrigger>
                <TabsTrigger value="chart">Grafik</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="mb-4 text-muted-foreground">Yükleniyor...</p>
                    <Progress value={33} className="w-[60%]" />
                  </div>
                ) : filteredAccounts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Hiçbir sonuç bulunamadı.</p>
                    <p className="text-sm text-muted-foreground mt-1">Lütfen farklı filtreler deneyin.</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>İsim</TableHead>
                            <TableHead>Hesap No</TableHead>
                            <TableHead>Hesap Türü</TableHead>
                            <TableHead>Transfer Tutarı</TableHead>
                            <TableHead>Risk Puanı</TableHead>
                            <TableHead>İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAccounts.map((account, index) => {
                            const riskLevel = getRiskLevel(account.puan)
                            let riskBadge

                            if (riskLevel === "high") {
                              riskBadge = <Badge variant="destructive">{account.puan} - Yüksek</Badge>
                            } else if (riskLevel === "medium") {
                              riskBadge = <Badge variant="warning">{account.puan} - Orta</Badge>
                            } else {
                              riskBadge = <Badge variant="success">{account.puan} - Düşük</Badge>
                            }

                            return (
                              <TableRow key={index}>
                                <TableCell>{account.isim}</TableCell>
                                <TableCell className="font-mono text-xs">{account.hesap_numarasi}</TableCell>
                                <TableCell>{account.hesap_turu}</TableCell>
                                <TableCell>{account.transfer_tutari} TL</TableCell>
                                <TableCell>{riskBadge}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" onClick={() => showAccountDetails(account)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportToCSV}
                        disabled={filteredAccounts.length === 0}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" disabled={filteredAccounts.length === 0}>
                        <FilePdf className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        disabled={filteredAccounts.length === 0}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Yazdır
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="chart">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="mb-4 text-muted-foreground">Yükleniyor...</p>
                    <Progress value={33} className="w-[60%]" />
                  </div>
                ) : filteredAccounts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Hiçbir sonuç bulunamadı.</p>
                    <p className="text-sm text-muted-foreground mt-1">Lütfen farklı filtreler deneyin.</p>
                  </div>
                ) : (
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-4">Risk Puanı Dağılımı</h3>
                    <div className="chart-container relative h-[300px] mt-8 ml-10">
                      <div className="chart-y-axis">
                        <div className="chart-y-label">10</div>
                        <div className="chart-y-label">8</div>
                        <div className="chart-y-label">6</div>
                        <div className="chart-y-label">4</div>
                        <div className="chart-y-label">2</div>
                        <div className="chart-y-label">0</div>
                      </div>

                      {prepareChartData().map((count, score) => {
                        const maxCount = Math.max(...prepareChartData())
                        const height = maxCount > 0 ? (count / maxCount) * 100 : 0

                        let bgColor = "bg-success"
                        if (score >= 9) {
                          bgColor = "bg-destructive"
                        } else if (score >= 6) {
                          bgColor = "bg-warning"
                        }

                        return (
                          <div key={score}>
                            <div
                              className={`chart-bar ${bgColor}`}
                              style={{
                                left: `${score * 9 + 5}%`,
                                height: `${height}%`,
                              }}
                            ></div>
                            <div className="chart-label text-muted-foreground" style={{ left: `${score * 9 + 5}%` }}>
                              {score}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-12 flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span className="text-sm">Düşük Risk (0-5)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-warning rounded-full"></div>
                        <span className="text-sm">Orta Risk (6-8)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                        <span className="text-sm">Yüksek Risk (9-10)</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="mt-4" onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Verileri İndir
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Hesap Detay Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedAccount?.isim} - Hesap Detayları</DialogTitle>
          </DialogHeader>

          {selectedAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hesap Numarası</p>
                  <p className="font-mono">{selectedAccount.hesap_numarasi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hesap Türü</p>
                  <p>{selectedAccount.hesap_turu}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Tutarı</p>
                  <p>{selectedAccount.transfer_tutari} TL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Saati</p>
                  <p>{selectedAccount.transfer_saati}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gelir</p>
                  <p>{selectedAccount.gelir} TL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kara Listede</p>
                  <p>{selectedAccount["kara listede hesap"]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Yurt Dışı Transfer</p>
                  <p>{selectedAccount["Yurt dışı transfer büyüklüğü"]} TL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ters İbraz Oranı</p>
                  <p>%{selectedAccount["Ters İbraz Oranı"]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kredi Kartı Harcama</p>
                  <p>{selectedAccount["Kredi Kartı Harcama"]} TL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hesap Bakiyesi</p>
                  <p>{selectedAccount["Hesap Bakiyesi"]} TL</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Risk Puanı</p>
                {getRiskLevel(selectedAccount.puan) === "high" ? (
                  <Badge variant="destructive" className="mt-1">
                    {selectedAccount.puan} - Yüksek Risk
                  </Badge>
                ) : getRiskLevel(selectedAccount.puan) === "medium" ? (
                  <Badge variant="warning" className="mt-1">
                    {selectedAccount.puan} - Orta Risk
                  </Badge>
                ) : (
                  <Badge variant="success" className="mt-1">
                    {selectedAccount.puan} - Düşük Risk
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
