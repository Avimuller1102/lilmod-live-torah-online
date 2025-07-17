import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800 mb-1">
            Configuration de sécurité requise
          </p>
          <p className="text-yellow-700">
            Pour une sécurité optimale, configurez les variables d'environnement pour les clés API 
            et intégrez un service d'email backend sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;