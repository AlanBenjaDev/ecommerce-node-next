export default function Failure() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pago fallido 😕</h1>
      <p className="text-gray-700">Hubo un problema al procesar tu pago. Intentá nuevamente.</p>
    </div>
  );
}