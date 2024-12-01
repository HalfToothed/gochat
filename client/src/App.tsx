
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import SignIn from './components/signIn'
import SignUp from './components/signUp'
import Chat from "./components/chat";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
