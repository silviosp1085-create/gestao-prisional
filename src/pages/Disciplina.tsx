import React, { useState, useEffect } from 'react';
import { db, Disciplina as DisciplinaType } from '../lib/storage';
import { Plus, Trash2, Search, AlertTriangle } from 'lucide-react';

export default function Disciplina() {
  const [items, setItems] = useState<DisciplinaType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMatricula, setSearchMatricula] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    motivo: '',
    dataInicio: '',
    previsaoSaida: '',
  });

  useEffect(() => {
    const unsubscribe = db.subscribe<DisciplinaType>('disciplina', (data) => {
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.add<DisciplinaType>('disciplina', formData);
      setShowForm(false);
      setFormData({ nome: '', matricula: '', motivo: '', dataInicio: '', previsaoSaida: '' });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await db.delete('disciplina', id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const isLate = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exitDate = new Date(dateString);
    return exitDate < today;
  };

  const filteredItems = items.filter((item) => {
    const matchesName = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMatricula = item.matricula.toLowerCase().includes(searchMatricula.toLowerCase());
    return matchesName && matchesMatricula;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Isolamento / Castigo</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Novo Registro
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Registrar Sanção Disciplinar
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Preso</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                <input
                  type="text"
                  required
                  placeholder="Número da matrícula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo da Sanção</label>
                <input
                  type="text"
                  required
                  placeholder="Infração cometida"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input
                  type="date"
                  required
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Saída</label>
                <input
                  type="date"
                  required
                  value={formData.previsaoSaida}
                  onChange={(e) => setFormData({ ...formData, previsaoSaida: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center bg-gray-50">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 w-full md:w-64"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filtrar por matrícula..."
              value={searchMatricula}
              onChange={(e) => setSearchMatricula(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 w-full md:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-gray-200">Nome</th>
                <th className="p-4 font-medium border-b border-gray-200">Matrícula</th>
                <th className="p-4 font-medium border-b border-gray-200">Motivo</th>
                <th className="p-4 font-medium border-b border-gray-200">Início</th>
                <th className="p-4 font-medium border-b border-gray-200">Previsão Saída</th>
                <th className="p-4 font-medium border-b border-gray-200 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Nenhum registro encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const late = isLate(item.previsaoSaida);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{item.nome}</td>
                      <td className="p-4 font-mono text-sm">{item.matricula}</td>
                      <td className="p-4 max-w-xs truncate" title={item.motivo}>{item.motivo}</td>
                      <td className="p-4 whitespace-nowrap">{new Date(item.dataInicio).toLocaleDateString('pt-BR')}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {new Date(item.previsaoSaida).toLocaleDateString('pt-BR')}
                          {late && ' (Atrasado)'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
