import * as React from "react"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { SynMindLogo } from "@/components/brand"

/**
 * NavItem Interface
 *
 * Item de navegação para a Navbar.
 */
interface NavItem {
  /** Texto do link */
  label: string
  /** URL de destino */
  href: string
  /** Estado ativo (destaque visual) */
  active?: boolean
}

/**
 * Navbar Component
 *
 * Barra de navegação responsiva com suporte a variantes B2B/B2C.
 * Inclui menu mobile, logo customizável e área de ações.
 *
 * @example
 * <Navbar
 *   variant="b2b"
 *   logo={<Logo />}
 *   items={[{ label: "Home", href: "/", active: true }]}
 *   actions={<Button>Login</Button>}
 * />
 */
interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Tema de cores: default (#5B7B93), b2b, b2c (#D98D38) */
  variant?: "default" | "b2b" | "b2c"
  /** Array de NavItem para links de navegação */
  items?: NavItem[]
  /** Elemento React para o logo */
  logo?: React.ReactNode
  /** Área de ações (botões, dropdown) */
  actions?: React.ReactNode
  /** Fixar navbar no topo */
  sticky?: boolean
  /** Callback ao clicar em item */
  onNavigate?: (href: string) => void
}

function Navbar({
  className,
  variant = "default",
  items = [],
  logo,
  actions,
  sticky = true,
  onNavigate,
  ...props
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const activeColor = variant === "b2c"
    ? "text-[#D98D38]"
    : "text-[#5B7B93]"

  const handleNavClick = (href: string) => {
    onNavigate?.(href)
    setMobileMenuOpen(false)
  }

  return (
    <header
      data-slot="navbar"
      className={cn(
        "w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        sticky && "sticky top-0 z-50",
        className
      )}
      {...props}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo || (
            <SynMindLogo
              variant="full"
              size="sm"
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {items.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                item.active
                  ? cn(activeColor, "bg-primary/5")
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          {actions}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {items.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? cn(activeColor, "bg-primary/5")
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.label}
              </button>
            ))}
            {actions && (
              <div className="pt-4 border-t mt-4 flex flex-col gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export { Navbar }
export type { NavItem, NavbarProps }
