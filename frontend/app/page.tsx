import JiraDashboard from "@/components/jira-dashboard"

export default function Home() {
  return (
    <div className="bg-muted/40 min-h-screen">
      {/* 學員測試修改：如果你看到這行文字，表示 Docker 環境正常運作！ */}
      <div className="p-4 text-center bg-green-100 border-b">
        <p className="text-green-800 font-semibold">
          🎉 Docker 環境測試成功！修改已即時生效
        </p>
      </div>
      <JiraDashboard />
    </div>
  )
}
