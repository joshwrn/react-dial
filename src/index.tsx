import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import type { DraggableData, DraggableEvent } from "react-draggable"
import { DraggableCore } from "react-draggable"
import type { FlattenInterpolation, ThemeProps } from "styled-components"
import styled from "styled-components"

import { CircleDiv, useSize } from "./Circle"

export type CSSProps = FlattenInterpolation<ThemeProps<unknown>> | undefined

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
const Notches = styled.div`
  width: 80%;
  height: 80%;
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  transition: opacity 0.5s;
  background-image: url("data:image/svg+xml,%3csvg width='50%25' height='50%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='%23333' stroke-width='4' stroke-dasharray='1%2c 13' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
`
const Container = styled.div`
  width: 96%;
  height: 96%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
`
const Inner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(#eeeeee, #c2c2c2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 0 40px 1px #84848418;
  border: 1px solid rgb(255, 255, 255, 0.05);
  transition: transform 0.15s;
`
const Gradient = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, #c5c5c5 90%);
  z-index: 1;
`
const TextWrapper = styled.div`
  position: absolute;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 32px;
    color: #57575789;
  }
  p {
    font-size: 15px;
    color: #57575789;
  }
`
const Handle = styled.div<{ pos: number }>`
  width: 8.5%;
  height: 8.5%;
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
const Grab = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 10;
  cursor: pointer;
`
const NotchesLight = styled(Notches)`
  filter: blur(4px);
  opacity: 0;
`
const Outer = styled.div<{ isDragging: boolean }>`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: #c5c5c5;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.187);
  ${Notches} {
    opacity: ${({ isDragging }) => (isDragging ? 0.75 : 0.4)};
  }
  ${NotchesLight} {
    opacity: ${({ isDragging }) => (isDragging ? 0.75 : 0)};
  }
  :hover {
    ${Notches} {
      opacity: 0.75;
    }
  }
`

export const Dial: FC<{
  max?: number
  min?: number
  increment?: number
  initial?: number
  showNotches?: boolean
}> = ({
  max = 360,
  min = 0,
  increment = 45,
  initial = 0,
  showNotches = true,
}) => {
  const [deg, setDeg] = useState(
    min > initial ? min : max < initial ? max : initial
  )
  const [handlePos, setHandlePos] = useState(0)
  const [diff, setDiff] = useState(0)
  const dragRef = useRef(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const size = useSize(dialRef)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = (f: DraggableEvent, d: DraggableData) => {
    const y = -d.deltaY
    setDiff((prev) => prev + d.deltaX + y)
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
      setDeg((prev) => (prev + increase <= max ? prev + increase : prev))
    }
    if (diff <= -increment) {
      setDiff(0)
      setDeg((prev) => (prev - increase >= min ? prev - increase : prev))
    }
  }, [diff])

  return (
    <Wrapper>
      <Outer isDragging={isDragging}>
        {showNotches && (
          <>
            <Gradient />
            <Notches />
            {/* <NotchesLight /> */}
          </>
        )}
        <CircleDiv progress={(deg / 360) * 100}>
          <Container>
            <Inner
              style={{
                transform: `rotate(${deg}deg)`,
              }}
              ref={dialRef}
            >
              <Handle ref={handleRef} pos={handlePos} />
            </Inner>
            <TextWrapper>
              <h3>{Math.round(deg)}</h3>
              <p>Degrees</p>
            </TextWrapper>
            <DraggableCore
              onStart={() => setIsDragging(true)}
              onStop={() => setIsDragging(false)}
              onDrag={handleDrag}
              ref={dragRef}
            >
              <Grab />
            </DraggableCore>
          </Container>
        </CircleDiv>
      </Outer>
    </Wrapper>
  )
}
