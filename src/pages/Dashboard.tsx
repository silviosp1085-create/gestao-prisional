import { useEffect, useState } from 'react';
import { db } from '../lib/storage';
import { ShieldAlert, UserPlus, UserMinus, Gavel, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    blitz: 0,
    inclusoes: 0,
    transferencias: 0,
    disciplina: 0,
  });

  useEffect(() => {
    const unsubBlitz = db.subscribe('blitz', (data) => setStats(s => ({ ...s, blitz: data.length })));
    const unsubInclusoes = db.subscribe('inclusoes', (data) => setStats(s => ({ ...s, inclusoes: data.length })));
    const unsubTransferencias = db.subscribe('transferencias', (data) => setStats(s => ({ ...s, transferencias: data.length })));
    const unsubDisciplina = db.subscribe('disciplina', (data) => setStats(s => ({ ...s, disciplina: data.length })));

    return () => {
      unsubBlitz();
      unsubInclusoes();
      unsubTransferencias();
      unsubDisciplina();
    };
  }, []);

  const cards = [
    { title: 'Total de Blitz', value: stats.blitz, icon: ShieldAlert, color: 'bg-blue-500' },
    { title: 'Inclusões Recentes', value: stats.inclusoes, icon: UserPlus, color: 'bg-green-500' },
    { title: 'Transferências', value: stats.transferencias, icon: UserMinus, color: 'bg-orange-500' },
    { title: 'Em Isolamento', value: stats.disciplina, icon: Gavel, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
              <div className={`p-4 rounded-lg ${card.color} text-white mr-4`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="mr-2" size={20} />
          Visão Geral do Sistema
        </h2>
        <p className="text-gray-600">
          Bem-vindo ao Sistema de Gestão Prisional. Utilize o menu lateral para registrar movimentações,
          disciplina e rotinas de segurança.
        </p>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h3 className="font-medium text-slate-800 mb-2">Avisos Importantes:</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Mantenha os registros de blitz atualizados diariamente.</li>
            <li>Verifique as previsões de saída do isolamento disciplinar.</li>
            <li>Confira a documentação antes de registrar transferências.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
