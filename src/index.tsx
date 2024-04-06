import type { CSSProperties, FC } from "react"
import React, { useEffect, useRef, useState } from "react"

import type { DraggableData, DraggableEvent } from "react-draggable"
import { DraggableCore } from "react-draggable"
import styled from "styled-components"

import { CircleDiv, useSize } from "./Circle"

const BG = `#111111`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease-in-out;
  position: relative;
  * {
    margin: 0;
    padding: 0;
  }
`
const DialContainer = styled.div`
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
`
const Gradient = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, ${BG} 90%);
  z-index: 1;
`
const ChildWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
`
const HandleContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.15s;
`
const Handle = styled.div<{ pos: number }>`
  width: 7.5%;
  height: 7.5%;
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background: #0084ff;
  transition: box-shadow 0.5s;
  cursor: pointer;
  position: absolute;
  box-shadow: 0 0 15px 0px #0084ff7d;
  transform: translateY(${({ pos }) => pos}px);
`
const StyledDial = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: -1;
  cursor: pointer;
  border-radius: 50%;
  background: ${BG};
  box-shadow: 20px 20px 100px #000000, -20px -20px 100px #303030;
  border: 1px solid #383838;
`
const Outer = styled.div<{ isDragging: boolean }>`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: ${BG};
  display: flex;
  justify-content: center;
  align-items: center;
`
const toDeg = (rad: number) => {
  return rad * (180 / Math.PI)
}

const getDegFromQuadrant = (
  point: { x: number; y: number },
  deg: number,
  lastQuadrant: number,
  setLastQuadrant: React.Dispatch<React.SetStateAction<number>>
): number => {
  const q1 = point.x >= 0 && point.y >= 0
  const q2 = point.x <= 0 && point.y >= 0
  const q3 = point.x <= 0 && point.y <= 0
  const q4 = point.x >= 0 && point.y <= 0
  if (q1 || q4) {
    if (lastQuadrant === 2) {
      return -90 - deg
    }
    setLastQuadrant(q1 ? 1 : 4)
    return 270 - deg
  }
  if (q2 || q3) {
    if (lastQuadrant === 1) {
      return 450 + deg
    }
    setLastQuadrant(q2 ? 2 : 3)
    return 90 + deg
  }
  return 0
}

export const Dial: FC<{
  max?: number
  min?: number
  increment?: number
  initial?: number
  showNotches?: boolean
  realisticDrag?: boolean
  debugRealisticDrag?: boolean
  children?: JSX.Element
  degrees: number
  setDegrees: React.Dispatch<React.SetStateAction<number>>
  showProgress?: boolean
  dialStyle?: CSSProperties
  handleStyle?: CSSProperties
  mustUseHandle: boolean
}> = ({
  max = 360,
  min = 0,
  increment = 45,
  showNotches = true,
  realisticDrag = true,
  degrees = 0,
  setDegrees,
  children,
  showProgress = true,
  dialStyle,
  handleStyle,
  debugRealisticDrag = false,
  mustUseHandle = false,
}) => {
  const [handlePos, setHandlePos] = useState(0)
  const diff = useRef(0)
  const dragRef = useRef(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const handleDragRef = useRef(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const size = useSize(dialRef)
  const [isDragging, setIsDragging] = useState(false)
  const [debugCoords, setDebugCoords] = useState({ x: 0, y: 0 })
  const [lastQuadrant, setLastQuadrant] = useState(2)

  const turnDialRealistic = (f: DraggableEvent, d: DraggableData) => {
    const e = f as MouseEvent
    if (!dialRef.current) return
    const ref = dialRef.current
    const box = ref.getBoundingClientRect()
    const centerPoint = {
      y: box.top + box.height / 2,
      x: box.left + box.width / 2,
    }
    const mouse = { x: e.clientX, y: e.clientY }
    const point = { x: centerPoint.x - mouse.x, y: centerPoint.y - mouse.y }
    const sin = point.y / Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
    const cos = point.x / Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
    debugRealisticDrag &&
      setDebugCoords({ x: -cos * (box.height / 2), y: -sin * (box.height / 2) })
    const theta = Math.asin(sin)
    const degrees = getDegFromQuadrant(
      { x: -cos, y: -sin },
      toDeg(theta),
      lastQuadrant,
      setLastQuadrant
    )
    const increase = increment * Math.floor(degrees / increment)
    setDegrees(increase > max ? max : increase < min ? min : increase)
  }

  const turnDial = (f: DraggableEvent, d: DraggableData) => {
    diff.current = diff.current + d.deltaX + -d.deltaY
    const increase = increment * Math.floor(Math.abs(diff.current) / increment)
    if (diff.current >= increment) {
      diff.current = 0
      setDegrees((prev) => (prev + increase <= max ? prev + increase : prev))
      return
    }
    if (diff.current <= -increment) {
      diff.current = 0
      setDegrees((prev) => (prev - increase >= min ? prev - increase : prev))
      return
    }
  }

  useEffect(() => {
    const h = handleRef.current
    if (!h || !size) return
    setHandlePos(size.width / 2 - h.offsetHeight)
  }, [size, showProgress])

  return (
    <Wrapper>
      <Outer isDragging={isDragging}>
        {showNotches && (
          <>
            <Gradient />
            <svg
              viewBox="0 0 200 200"
              style={{
                position: `absolute`,
                width: `80%`,
                height: `80%`,
                borderRadius: `50%`,
              }}
            >
              <circle
                cx="50%"
                cy="50%"
                r="50%"
                transform="rotate(90 100 100)"
                fill="none"
                stroke={isDragging ? `#0084ff` : `#dddddd`}
                strokeDasharray={`1, 18`}
                strokeWidth="4"
                opacity={isDragging ? 0.75 : 0.3}
                strokeLinecap="butt"
              />
            </svg>
          </>
        )}
        <DialContainer
          style={{
            width: `60%`,
            height: `60%`,
            cursor: mustUseHandle ? `initial` : `pointer`,
          }}
        >
          <HandleContainer
            style={{
              transform: `rotate(${degrees}deg)`,
              pointerEvents: mustUseHandle ? `all` : `none`,
            }}
          >
            <DraggableCore
              onStart={() => setIsDragging(true)}
              onStop={() => setIsDragging(false)}
              onDrag={realisticDrag ? turnDialRealistic : turnDial}
              ref={handleDragRef}
            >
              <Handle style={handleStyle} ref={handleRef} pos={handlePos} />
            </DraggableCore>
          </HandleContainer>

          <ChildWrapper>{children}</ChildWrapper>
          {debugRealisticDrag && realisticDrag && (
            <div
              style={{
                position: `absolute`,
                transform: `translate(${debugCoords.x}px, ${debugCoords.y}px)`,
                background: `red`,
                zIndex: 20,
                width: `15px`,
                height: `15px`,
              }}
            />
          )}
          <DraggableCore
            onStart={() => setIsDragging(true)}
            onStop={() => setIsDragging(false)}
            onDrag={realisticDrag ? turnDialRealistic : turnDial}
            ref={dragRef}
          >
            <StyledDial ref={dialRef} style={dialStyle} />
          </DraggableCore>
          {showProgress && <CircleDiv progress={(degrees / 360) * 100} />}
        </DialContainer>
      </Outer>
    </Wrapper>
  )
}
