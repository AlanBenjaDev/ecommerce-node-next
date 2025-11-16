export default function Pending() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Pago pendiente</h1>
      <p className="text-gray-700">Tu pago está en proceso de verificación.</p>
    </div>
  );
}