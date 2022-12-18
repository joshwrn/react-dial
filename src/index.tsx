import type { FC } from "react"
import React, { useEffect, useRef, useState } from "react"

import type { MotionProps } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import type { DraggableData, DraggableEvent } from "react-draggable"
import { DraggableCore } from "react-draggable"
import type { FlattenInterpolation, ThemeProps } from "styled-components"
import styled from "styled-components"

export type CSSProps = FlattenInterpolation<ThemeProps<unknown>> | undefined

const Wrapper = styled(motion.div)`
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
  width: 400px;
  height: 400px;
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  transition: opacity 0.5s;
  background-image: url("data:image/svg+xml,%3csvg width='50%25' height='50%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='%23FFFFFF' stroke-width='4' stroke-dasharray='1%2c 13' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
`

const Container = styled.div`
  width: 300px;
  height: 300px;
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
  background: #252525;
  background: radial-gradient(#525252, #333333);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 0 40px 1px #0000003c;
  border: 1px solid rgb(255, 255, 255, 0.05);
  transition: transform 0.15s;
`
const Gradient = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, #3c3c3c 90%);
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
  }
  p {
    font-size: 15px;
    color: #ffffff8a;
  }
`
const Handle = styled(motion.div)<{ coords: { x: number; y: number } }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #0084ff;
  transition: box-shadow 0.5s;
  cursor: pointer;
  position: absolute;
  box-shadow: 0 0 15px 0px #0084ff7d;
  transform: translateY(${({ coords }) => coords.y}px);
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
const Outer = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #3c3c3c;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.187);
  :hover {
    ${Notches} {
      opacity: 0.75;
    }
  }
`

const toRads = (deg: number) => {
  return deg * (Math.PI / 180)
}
const toDeg = (rad: number) => {
  return rad * (180 / Math.PI)
}
type WrapAround = (value: number, range: [min: number, max: number]) => number
export const wrapAround: WrapAround = (value, [min, max]) =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min
const inCircle = (num: number) => {
  const res = wrapAround(toDeg(num), [0 - 180, 360 - 180])
  return toRads(res)
}

export const Dial: FC = () => {
  const [rads, setRads] = useState(toRads(-90))
  // const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [diff, setDiff] = useState(0)
  const dragRef = useRef(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)

  const handleDrag = (f: DraggableEvent, d: DraggableData) => {
    setDiff((prev) => prev + d.deltaX)
  }

  useEffect(() => {
    if (!handleRef.current) return
    const increase = toRads(45)

    if (diff > 75) {
      setDiff(0)
      setRads((prev) => prev + increase)
    }
    if (diff < -75) {
      setDiff(0)
      setRads((prev) => prev - increase)
    }
  }, [diff])

  // useEffect(() => {
  //   const element = dialRef.current
  //   const handle = handleRef.current
  //   if (!element || !handle) return
  //   const handleSize = handle.offsetHeight
  //   const height = element.offsetHeight

  //   const x = Math.cos(rads) * (height / 2 - handleSize)
  //   const y = Math.sin(rads) * (height / 2 - handleSize)
  //   setCoords({ x, y })
  // }, [setCoords, rads])

  return (
    <Wrapper>
      <Outer>
        <Gradient />
        <Notches />
        <NotchesLight />
        <Container>
          <Inner
            style={{
              transform: `rotate(${rads}rad)`,
            }}
            ref={dialRef}
          >
            <Handle ref={handleRef} coords={{ x: 0, y: -125 }} />
          </Inner>
          <TextWrapper>
            <h3>{Math.round(toDeg(rads) + 180)}</h3>
            <p>Degrees</p>
          </TextWrapper>
          <DraggableCore onDrag={handleDrag} ref={dragRef}>
            <Grab />
          </DraggableCore>
        </Container>
      </Outer>
    </Wrapper>
  )
}
