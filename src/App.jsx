import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = ' http://127.0.0.1:8000/api/snippets';

export default function App() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    code: '',
  });
  const [snippets, setSnippets] = useState([]);
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null); // message de succès ou erreur

  useEffect(() => {
    fetchSnippets();
  }, [filter]);

  const fetchSnippets = async () => {
    try {
      const url = filter ? `${API_URL}?category=${filter}` : API_URL;
      const response = await axios.get(url);
      setSnippets(response.data);
    } catch (error) {
      showNotification('Erreur lors du chargement', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.code) {
      showNotification('Tous les champs sont obligatoires.', 'error');
      return;
    }

    try {
      await axios.post(API_URL, form);
      setForm({ title: '', description: '', category: '', code: '' });
      fetchSnippets();
      showNotification('Snippet ajouté avec succès ✅');
    } catch (error) {
      showNotification('Erreur lors de l\'ajout', 'error');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Code copié !');
    } catch {
      showNotification('Échec de la copie', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 relative">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-white ${
              notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-5xl font-bold text-center text-blue-700 mb-12 drop-shadow">
        💡 1Fonction - Snippets Hub
      </h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white/80 backdrop-blur p-6 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Titre" value={form.title} onChange={handleChange} className="border rounded p-3" />
          <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded p-3" />
          <select name="category" value={form.category} onChange={handleChange} className="border rounded p-3" required>
            <option value="">Choisir catégorie</option>
            <option value="PHP">PHP</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
          </select>
        </div>
        <textarea
          name="code"
          placeholder="Ton code ici..."
          value={form.code}
          onChange={handleChange}
          rows={6}
          className="border rounded p-3 mt-4 w-full font-mono text-sm"
        />
        <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all">
          ➕ Ajouter
        </button>
      </motion.form>

      {/* Filtres */}
      <div className="max-w-3xl mx-auto mt-10 flex justify-center gap-3 flex-wrap">
        {['', 'PHP', 'HTML', 'CSS'].map((cat) => (
          <button
            key={cat || 'all'}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded shadow ${
              filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            } hover:scale-105 transition-transform`}
          >
            {cat || 'Tous'}
          </button>
        ))}
      </div>

      {/* Liste des snippets */}
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        {snippets.length === 0 && (
          <p className="text-center text-gray-600 text-lg">Aucun snippet trouvé.</p>
        )}
        <AnimatePresence>
          {snippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded shadow hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-800">
                  {snippet.title}
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded ml-2">
                    {snippet.category}
                  </span>
                </h2>
                <button
                  onClick={() => copyToClipboard(snippet.code)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  📋 Copier
                </button>
              </div>
              <p className="mb-2 text-gray-700">{snippet.description}</p>
              <pre className="bg-gray-100 rounded p-3 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                {snippet.code}
              </pre>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
