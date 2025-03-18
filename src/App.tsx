import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./Home";
import routes from "./routes";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
