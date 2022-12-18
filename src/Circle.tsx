import type { FC } from "react"
import React, { useEffect, useRef, useMemo } from "react"

import useResizeObserver from "@react-hook/resize-observer"
import styled from "styled-components"

export const useSize = (
  target: React.RefObject<HTMLDivElement>
): DOMRect | null => {
  const [size, setSize] = React.useState<DOMRect | null>(null)

  React.useLayoutEffect(() => {
    if (!target.current) return
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry: any) => setSize(entry?.contentRect))
  return size
}

interface Props {
  radius: number
  stroke: number
  progress: number
  accentColors: [string, string]
}

const CircularProgress: FC<Props> = ({
  radius,
  stroke,
  progress,
  accentColors,
}) => {
  const normalizedRadius = useMemo(() => radius - stroke / 2, [radius, stroke])
  const circumference = useMemo(
    () => normalizedRadius * 2 * Math.PI,
    [normalizedRadius]
  )
  const strokeDashOffset = useMemo(
    () => circumference - (progress / 100) * circumference,
    [circumference, progress]
  )

  const gradientId = `circle-gradient-${accentColors[0]}-${accentColors[1]}`

  return (
    <svg height={radius * 2} width={radius * 2}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accentColors[1]} />
          <stop offset="100%" stopColor={accentColors[0]} />
        </linearGradient>
      </defs>
      <BackgroundCircle
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ` ` + circumference}
        stroke-width={stroke}
        r={normalizedRadius > 0 ? normalizedRadius : 0}
        cx={radius}
        cy={radius}
        strokeDashoffset={0}
      />
      <Circle
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ` ` + circumference}
        stroke-width={stroke}
        stroke={`url(#${gradientId})`}
        r={normalizedRadius > 0 ? normalizedRadius : 0}
        cx={radius}
        cy={radius}
        strokeDashoffset={strokeDashOffset}
        strokeLinecap="round"
      />
    </svg>
  )
}

export const CircleDiv: FC<{
  progress?: number
  accentColors?: [string, string]
  fontSize?: number
  rounded?: boolean
  size?: string
  cursor?: string
  stroke?: number
  children?: React.ReactNode
}> = ({
  accentColors = [`#ff0000`, `#00ff00`],
  progress = 50,
  children,
  size = `60%`,
  cursor = `pointer`,
  stroke = 4,
}) => {
  const circleRef = useRef<HTMLDivElement>(null)
  const s = useSize(circleRef)
  const [radius, setRadius] = React.useState(0)
  useEffect(() => {
    if (s) {
      const { width } = s
      const { height } = s
      setRadius(width > height ? height / 2 : width / 2)
    } else {
      setRadius(parseInt(size) / 2)
    }
  }, [circleRef.current, s])
  return (
    <Wrapper ref={circleRef} size={size} cursor={cursor}>
      {children}
      <div style={{ position: `absolute`, width: `100%`, height: `100%` }}>
        <CircularProgress
          radius={radius}
          stroke={stroke}
          progress={progress > 100 ? 100 : progress}
          accentColors={accentColors}
        />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ size: string; cursor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  flex-shrink: 0;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  cursor: ${({ cursor }) => cursor};
`

const Circle = styled.circle`
  transition: stroke-dashoffset 0.15s;
  transform: rotate(90deg);
  transform-origin: 50% 50%;
`

const BackgroundCircle = styled(Circle)`
  stroke: var(--circle-background);
`

export default CircularProgress
