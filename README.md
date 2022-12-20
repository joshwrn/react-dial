React Dial Component

# Usage

```tsx
const App = () => {
  const [degrees, setDegrees] = useState(0)
  return (
    <Wrapper>
      <Dial
        min={0}
        max={360}
        increment={1}
        realisticDrag={false}
        degrees={degrees}
        setDegrees={setDegrees}
        showProgress={true}
      >
        <TextWrapper>
          <h3>{Math.round(degrees)}</h3>
          <p>Degrees</p>
        </TextWrapper>
      </Dial>
    </Wrapper>
  )
}
```
