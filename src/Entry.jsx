import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CredentialProvider } from "./hooks/useGoogleProvider";
import App from "./pages/App";
import Login from "./pages/Login";
import { lazy, Suspense } from "react";
import AuthMiddleware from "./middlewares/Auth";

const Welcome = lazy(() => import("./pages/Welcome"));
const TestFrame = lazy(() => import("./pages/TestFrame"));
const Upload = lazy(() => import("./pages/Upload"));
const FrameSelect = lazy(() => import("./pages/FrameSelect"));
const Preview = lazy(() => import("./pages/Preview"));
const Loading = lazy(() => import("./pages/Loading"));
const Gallery = lazy(() => import("./pages/Gallery"));

export function Entry() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/test-frame" element={<TestFrame />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery/:folderId" element={<Gallery />} />
        <Route path="/gallery" element={<Navigate to={"/"} replace />} />
        <Route element={<AuthMiddleware />}>
          <Route path="/app" element={<App />} />
          <Route path="/frame-select" element={<FrameSelect />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
