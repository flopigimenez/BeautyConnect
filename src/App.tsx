import { AppRouter } from "./routes/AppRouter";
import AppBootstrapAuth from "./AppBootstrapAuth";
function App() {
  return (
    <>
      <AppBootstrapAuth />
      <AppRouter />
    </>
  );
}

export default App;
