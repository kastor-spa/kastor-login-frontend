import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronsUpDown,
  LogOut,
  Phone,
  LayoutGrid,
} from 'lucide-react'
import { KastorLogo } from '@/components/brand/logo'
import { navigation, supportPhones } from '@/config/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <Link to="/" className="flex items-center justify-center px-2" aria-label="Inicio">
          {collapsed ? (
            <span className="flex size-8 items-center justify-center rounded-md bg-brand-orange font-heading text-lg font-bold text-white">
              k
            </span>
          ) : (
            <KastorLogo width={110} />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((category) => (
          <SidebarGroup key={category.label}>
            <SidebarGroupLabel>{category.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.modules.map((item) => {
                  const inferred = item.status === 'inferido'
                  return (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton
                        asChild
                        tooltip={inferred ? `${item.title} (inferido, pendiente de mapeo)` : item.title}
                        isActive={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`))}
                        className={inferred ? 'text-sidebar-foreground/60' : undefined}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : inferred ? (
                        <SidebarMenuBadge className="text-[10px] text-muted-foreground">?</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Soporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportPhones.map((phone) => (
                <SidebarMenuItem key={phone}>
                  <SidebarMenuButton asChild tooltip={`Soporte ${phone}`}>
                    <a href={`tel:${phone.replace(/\s/g, '')}`}>
                      <Phone />
                      <span className="tabular-nums">{phone}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-brand-purple text-white">HB</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Héctor Barrera</span>
                    <span className="truncate text-xs text-muted-foreground">
                      hector.barrera@kastor.cl
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/bienvenida')}>
                  <LayoutGrid />
                  Cambiar de producto
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/login')}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
