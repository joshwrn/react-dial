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
        dialStyle={{
          width: "200px",
          height: "200px",
          backgroundColor: "white",
          borderRadius: "50%",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
        }}
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
