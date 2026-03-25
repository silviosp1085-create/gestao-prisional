import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db as firestore } from './firebase';

export interface Blitz {
  id: string;
  data: string;
  pavilhao: string;
  celas: string;
  observacoes: string;
  createdAt?: any;
}

export interface Inclusao {
  id: string;
  nome: string;
  matricula: string;
  origem: string;
  motivo: string;
  dataChegada: string;
  createdAt?: any;
}

export interface Transferencia {
  id: string;
  nome: string;
  matricula: string;
  destino: string;
  dataTransferencia: string;
  createdAt?: any;
}

export interface Disciplina {
  id: string;
  nome: string;
  matricula: string;
  motivo: string;
  dataInicio: string;
  previsaoSaida: string;
  createdAt?: any;
}

type CollectionName = 'blitz' | 'inclusoes' | 'transferencias' | 'disciplina';

export const db = {
  subscribe: <T extends { id: string }>(collectionName: CollectionName, callback: (data: T[]) => void) => {
    const q = query(collection(firestore, collectionName), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(items);
    }, (error) => {
      console.error(`Error fetching ${collectionName}:`, error);
    });
  },
  add: async <T>(collectionName: CollectionName, item: Omit<T, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(firestore, collectionName), {
        ...item,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      throw error;
    }
  },
  delete: async (collectionName: CollectionName, id: string) => {
    try {
      await deleteDoc(doc(firestore, collectionName, id));
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      throw error;
    }
  }
};
