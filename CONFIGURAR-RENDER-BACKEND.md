# 🔧 CONFIGURAR BACKEND NO RENDER CORRETAMENTE

## Serviço: emporio-backend (no Render)

### 1. Vá em Settings:
https://dashboard.render.com/web/srv-cu5u5qe8ii6s73e5knfg/settings

### 2. Configure assim:

**General:**
- Name: `emporio-backend`
- Region: `Oregon (US West)`

**Build & Deploy:**
- Root Directory: `backend` ⚠️ IMPORTANTE
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
```
DATABASE_URL=postgresql://postgres.cztqxdogiabesdgpyogv:Rollex99Rollex@aws-0-us-west-2.pooler.supabase.com:5432/postgres
JWT_SECRET=chave-secreta-super-segura-producao-emporio-botanico-2026
CLOUDINARY_CLOUD_NAME=dhyblzugz
CLOUDINARY_API_KEY=629775744341559
CLOUDINARY_API_SECRET=IACl75fZDlj66c44Us981JkWDi0
NODE_ENV=production
PORT=3001
```

### 3. Salve e faça Manual Deploy:
- Clique em "Manual Deploy" → "Clear build cache & deploy"
- Aguarde 3-5 minutos

### 4. Depois configure o frontend:

**No serviço emporio-bothanico (Render):**
- Adicione: `NEXT_PUBLIC_API_URL=https://emporio-bothanico.onrender.com`
- Faça redeploy

---

**RESUMO DA ARQUITETURA CORRETA:**
- 🖥️ Backend (API): Render → `emporio-bothanico.onrender.com`
- 🌐 Frontend: Render → `emporiobothanico.com.br`
- 🗄️ Database: Supabase
- ☁️ Imagens: Cloudinary

**Vercel NÃO será usada.**
