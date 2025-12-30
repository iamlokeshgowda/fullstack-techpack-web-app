import ConfirmDialog from "./components/ConfirmDialog";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <ConfirmDialog />
    </>
  );
}

export default App;
