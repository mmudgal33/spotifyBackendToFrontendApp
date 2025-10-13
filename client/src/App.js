import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Dashboard from "./Dashboard"
// npm audit fix --force

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  // console.log('App.js ', code);
  return code ? <Dashboard code={code} /> : <Login />
}

export default App
