import { useCounterStore } from './store/counterStore'

function App() {
  const { count, increment, decrement } = useCounterStore()

  return (
    <div className="container mt-5">
      <h1>Counter: {count}</h1>
      <button className="btn btn-primary me-2" onClick={increment}>
        Increment
      </button>
      <button className="btn btn-secondary" onClick={decrement}>
        Decrement
      </button>
    </div>
  )
}

export default App
