import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get("t");
  const u = request.nextUrl.searchParams.get("u") || "{}";
  const dest = "/admin/dashboard";

  const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Redirecionando...</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#eef1f5;font-family:system-ui,sans-serif">
  <p style="color:#64748b">Redirecionando...</p>
  <script>
    (function(){
      var p=new URLSearchParams(location.search);
      var t=p.get('t');
      var u=p.get('u');
      if(t){
        try{localStorage.setItem('token',t);}catch(e){}
        if(u){try{localStorage.setItem('usuario',decodeURIComponent(u));}catch(e){localStorage.setItem('usuario','{}');}}
      }
      location.replace('${dest}');
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
