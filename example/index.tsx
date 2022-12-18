import "react-app-polyfill/ie11"
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
  background-color: #181818;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
  gap: 50px;
  color: #ffffffbd;
  font-family: sans-serif;
  user-select: none;
`

const App = () => {
  return (
    <Wrapper>
      <Dial />
    </Wrapper>
  )
}

ReactDOM.render(<App />, document.getElementById(`root`))
