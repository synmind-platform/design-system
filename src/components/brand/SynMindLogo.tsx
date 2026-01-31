import * as React from "react"
import { cn } from "@/lib/utils"

interface SynMindLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "full" | "symbol"
  colorScheme?: "default" | "white"
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: { full: { width: 120, height: 39 }, symbol: { width: 32, height: 32 } },
  md: { full: { width: 180, height: 58 }, symbol: { width: 48, height: 48 } },
  lg: { full: { width: 240, height: 78 }, symbol: { width: 64, height: 64 } },
  xl: { full: { width: 320, height: 103 }, symbol: { width: 96, height: 96 } },
}

const logoSrc = {
  full: {
    default: "/brand/logo-full.png",
    white: "/brand/logo-white.png",
  },
  symbol: {
    default: "/brand/logo-symbol.png",
    white: "/brand/logo-white.png",
  },
}

/**
 * SynMind Logo Component
 *
 * O símbolo representa duas pessoas conectadas através de arcos,
 * simbolizando "Conexão Viva. Transformação Real."
 *
 * Usa as imagens PNG oficiais da marca para garantir fidelidade visual.
 *
 * @param variant - full (logo + texto), symbol (apenas símbolo)
 * @param colorScheme - default (colorido), white (para fundos escuros)
 * @param size - sm, md, lg, xl
 */
export function SynMindLogo({
  variant = "full",
  colorScheme = "default",
  size = "md",
  className,
  style,
  ...props
}: SynMindLogoProps) {
  const dimensions = sizeMap[size][variant]
  const src = logoSrc[variant][colorScheme]

  return (
    <img
      src={src}
      alt="SynMind - Conexão Viva. Transformação Real."
      width={dimensions.width}
      height={dimensions.height}
      className={cn("synmind-logo", `synmind-logo-${variant}`, className)}
      style={{
        objectFit: "contain",
        ...style,
      }}
      {...props}
    />
  )
}

/**
 * SynMind Logo SVG Component (versão simplificada para ícones)
 *
 * Use este componente quando precisar de um ícone vetorial pequeno.
 * Para o logo oficial, use SynMindLogo com as imagens PNG.
 */
export function SynMindIcon({
  className,
  size = 24,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn("synmind-icon", className)}
      aria-label="SynMind"
      {...props}
    >
      {/* Círculos (cabeças) */}
      <circle cx="35" cy="10" r="8" fill="#D98D38" />
      <circle cx="58" cy="10" r="8" fill="#5B7B93" />

      {/* Arco azul esquerdo */}
      <path
        d="M8 85 C8 45, 22 28, 35 28"
        stroke="#5B7B93"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arco laranja grande (M) */}
      <path
        d="M35 28 C50 28, 50 28, 50 50 C50 28, 50 28, 65 28 C78 28, 92 45, 92 85"
        stroke="#D98D38"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arco azul interno */}
      <path
        d="M35 42 C42 42, 50 52, 50 85"
        stroke="#5B7B93"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default SynMindLogo
