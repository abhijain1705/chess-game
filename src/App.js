import Chess from "./chess";
import "./App.css";

function App() {
  function makeLocalStorageEmpty() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="App">
      <button onClick={makeLocalStorageEmpty}>new game</button>
      <Chess />
    </div>
  );
}

export default App;
