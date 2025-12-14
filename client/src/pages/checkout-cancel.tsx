import { useLocation } from "wouter";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento Cancelado
        </h1>

        <p className="text-gray-600 mb-6">
          O pagamento foi cancelado. Você pode tentar novamente quando quiser.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-gray-900 hover:bg-gray-800"
          >
            Voltar para a Loja
          </Button>
        </div>
      </div>
    </div>
  );
}
