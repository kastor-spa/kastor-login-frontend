import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { LoginPage } from '@/pages/login'
import { BienvenidaPage } from '@/pages/bienvenida'
import { IndexPage } from '@/pages/index'
import { UsuariosPage } from '@/pages/usuarios'
import { SistemaCobranzaPage } from '@/pages/sistema-cobranza'
import { TareasPage } from '@/pages/tareas'
import { PerfilesPage } from '@/pages/perfiles/listado'
import { PerfilFormPage } from '@/pages/perfiles/formulario'
import { UfPage } from '@/pages/uf'
import { FacturasKastorPage } from '@/pages/facturas-kastor'
import { FacturasCaleuPage } from '@/pages/facturas-caleu'
import { ComunidadLayout } from '@/layouts/comunidad-layout'
import { ComunidadInicioPage } from '@/pages/comunidad/inicio'
import { ComunidadModuloPage } from '@/pages/comunidad/modulo'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/bienvenida" element={<BienvenidaPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/cobranza" element={<SistemaCobranzaPage />} />
        <Route path="/tareas" element={<TareasPage />} />
        <Route path="/perfiles" element={<PerfilesPage />} />
        <Route path="/perfiles/nuevo" element={<PerfilFormPage key="nuevo" />} />
        <Route path="/perfiles/:id" element={<PerfilFormPage />} />
        <Route path="/uf" element={<UfPage />} />
        <Route path="/facturas/kastor" element={<FacturasKastorPage />} />
        <Route path="/facturas/caleu" element={<FacturasCaleuPage />} />
      </Route>
      {/* Dashboard de comunidad: sidebar de 2 niveles (productos + Kastor Contable). */}
      <Route path="/comunidades/:id" element={<ComunidadLayout />}>
        <Route index element={<ComunidadInicioPage />} />
        <Route path=":categoria" element={<ComunidadModuloPage />} />
        <Route path=":categoria/:modulo" element={<ComunidadModuloPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
