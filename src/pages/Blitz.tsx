import React, { useState, useEffect } from 'react';
import { db, Blitz as BlitzType } from '../lib/storage';
import { Plus, Trash2, Search } from 'lucide-react';

export default function Blitz() {
  const [items, setItems] = useState<BlitzType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [formData, setFormData] = useState({
    data: '',
    pavilhao: '',
    celas: '',
    observacoes: '',
  });

  useEffect(() => {
    const unsubscribe = db.subscribe<BlitzType>('blitz', (data) => {
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.add<BlitzType>('blitz', formData);
      setShowForm(false);
      setFormData({ data: '', pavilhao: '', celas: '', observacoes: '' });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await db.delete('blitz', id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.pavilhao.toLowerCase().includes(searchLower) ||
      item.celas.toLowerCase().includes(searchLower) ||
      item.observacoes.toLowerCase().includes(searchLower);

    let matchesDate = true;
    if (searchDate) {
      matchesDate = item.data === searchDate;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Registros de Blitz</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Blitz
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Registrar Nova Blitz</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Blitz</label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pavilhão/Raio</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Raio 1"
                  value={formData.pavilhao}
                  onChange={(e) => setFormData({ ...formData, pavilhao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Celas Revistadas</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 101, 102, 103"
                  value={formData.celas}
                  onChange={(e) => setFormData({ ...formData, celas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações/Apreensões</label>
                <textarea
                  rows={3}
                  placeholder="Detalhes sobre materiais apreendidos ou ocorrências..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-sm text-gray-500 font-medium">Data exata:</span>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {searchDate && (
              <button
                onClick={() => setSearchDate('')}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-gray-200">Data</th>
                <th className="p-4 font-medium border-b border-gray-200">Pavilhão/Raio</th>
                <th className="p-4 font-medium border-b border-gray-200">Celas</th>
                <th className="p-4 font-medium border-b border-gray-200">Observações</th>
                <th className="p-4 font-medium border-b border-gray-200 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum registro de blitz encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 font-medium text-gray-900">{item.pavilhao}</td>
                    <td className="p-4">{item.celas}</td>
                    <td className="p-4 max-w-xs truncate" title={item.observacoes}>
                      {item.observacoes || '-'}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
