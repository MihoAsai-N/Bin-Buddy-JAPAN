export const askSupport = async (message: string) => {
    const res = await fetch("http://localhost:8000/support/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
  
    if (!res.ok) throw new Error("サポートサーバーとの通信に失敗しました")
    const data = await res.json()
    return data.response
  }
  