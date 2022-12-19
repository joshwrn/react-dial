import "react-app-polyfill/ie11"
import { useState } from "react"
import * as React from "react"

import * as ReactDOM from "react-dom"
import styled from "styled-components"

import { Dial } from "../."

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #989898;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
  color: #ffffffbd;
  font-family: sans-serif;
  user-select: none;
  * {
    margin: 0;
    padding: 0;
  }
`

const Inputs = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 15px;
  top: 50px;
  right: 50px;
  border-radius: 18px;
  padding: 15px;
  background-color: #646464bc;
  > div {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  input {
    width: 50px;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 5px;
    color: #ffffffbd;
    border-bottom: 1px solid #ecececba;
  }
`
const Container = styled.div`
  width: 500px;
  height: 500px;
  max-width: 50vw;
  max-height: 90vh;
  min-width: 250px;
  min-height: 250px;
  resize: both;
  overflow: hidden;
  position: relative;
  z-index: 5;
  ::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #6464643d;
    border-radius: 50%;
  }
`

const App = () => {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(360)
  const [increment, setIncrement] = useState(45)
  const [realisticDrag, setRealisticDrag] = useState(false)
  return (
    <Wrapper>
      <Container>
        <Dial
          min={min}
          max={max}
          increment={increment}
          realisticDrag={realisticDrag}
        />
      </Container>
      <Inputs>
        <div>
          <p>Min</p>
          <input
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            type="number"
          />
        </div>
        <div>
          <p>Max</p>
          <input
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            type="number"
          />
        </div>
        <div>
          <p>Increment</p>
          <input
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
            type="number"
          />
        </div>
        <div>
          <p>Realistic Drag</p>
          <input
            checked={realisticDrag}
            onChange={(e) => setRealisticDrag(e.target.checked)}
            type="checkbox"
          />
        </div>
      </Inputs>
    </Wrapper>
  )
}

ReactDOM.render(<App />, document.getElementById(`root`))
