import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import type { DraggableData, DraggableEvent } from "react-draggable"
import { DraggableCore } from "react-draggable"
import type { FlattenInterpolation, ThemeProps } from "styled-components"
import styled from "styled-components"

import { CircleDiv, useSize } from "./Circle"

export type CSSProps = FlattenInterpolation<ThemeProps<unknown>> | undefined

const BG = `#e0e0e0`

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
  pointer-events: none;
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
  box-shadow: 20px 20px 100px #bebebe, -20px -20px 100px #ffffff;
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

export const Dial: FC<{
  max?: number
  min?: number
  increment?: number
  initial?: number
  showNotches?: boolean
  realisticDrag?: boolean
  children?: JSX.Element
  degrees: number
  setDegrees: React.Dispatch<React.SetStateAction<number>>
}> = ({
  max = 360,
  min = 0,
  increment = 45,
  showNotches = true,
  realisticDrag = false,
  degrees = 0,
  setDegrees,
  children,
}) => {
  const [handlePos, setHandlePos] = useState(0)
  const [diff, setDiff] = useState(0)
  const dragRef = useRef(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const size = useSize(dialRef)
  const [isDragging, setIsDragging] = useState(false)

  const handleRealisticDrag = (f: DraggableEvent, d: DraggableData) => {
    const y = degrees < 180 ? -d.deltaY : d.deltaY
    const x = degrees < 90 || degrees > 270 ? -d.deltaX : d.deltaX
    setDiff((prev) => prev + x / 2 + y / 2)
  }

  const handleDrag = (f: DraggableEvent, d: DraggableData) => {
    setDiff((prev) => prev + d.deltaX + -d.deltaY)
  }

  useEffect(() => {
    const h = handleRef.current
    if (!h || !size) return
    setHandlePos(size.width / 2 - h.offsetHeight)
  }, [size])

  useEffect(() => {
    if (!handleRef.current) return
    const increase = increment * Math.floor(Math.abs(diff) / increment)
    if (diff >= increment) {
      setDiff(0)
      setDegrees((prev) => (prev + increase <= max ? prev + increase : prev))
    }
    if (diff <= -increment) {
      setDiff(0)
      setDegrees((prev) => (prev - increase >= min ? prev - increase : prev))
    }
  }, [diff])

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
                stroke={isDragging ? `#0084ff` : `#242424`}
                strokeDasharray={`1, 18`}
                strokeWidth="4"
                opacity={isDragging ? 0.75 : 0.3}
                strokeLinecap="butt"
              />
            </svg>
          </>
        )}
        <CircleDiv progress={(degrees / 360) * 100}>
          <DialContainer>
            <HandleContainer
              style={{
                transform: `rotate(${degrees}deg)`,
              }}
              ref={dialRef}
            >
              <Handle ref={handleRef} pos={handlePos} />
            </HandleContainer>
            <ChildWrapper>{children}</ChildWrapper>
            <DraggableCore
              onStart={() => setIsDragging(true)}
              onStop={() => setIsDragging(false)}
              onDrag={realisticDrag ? handleRealisticDrag : handleDrag}
              ref={dragRef}
            >
              <StyledDial />
            </DraggableCore>
          </DialContainer>
        </CircleDiv>
      </Outer>
    </Wrapper>
  )
}
