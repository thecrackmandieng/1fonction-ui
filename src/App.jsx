import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://127.0.0.1:8000/api/snippets';

function Stars({ count = 150 }) {
  const stars = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {stars.map(({ id, left, top, size, delay }) => (
        <motion.div
          key={id}
          className="bg-white rounded-full"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            opacity: 0.8,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingFunctions() {
  const functions = [
    {
      code: (
        <span className="text-white">
          <span className="text-blue-400 font-bold">function</span>{' '}
          <span className="text-orange-400">greet</span>() {'{ '}
          <span className="text-purple-400">console.log</span>('Hello React'); {'}'}
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-purple-400">body</span> {'{ '}
          <span className="text-green-400">background-color:</span>{' '}
          <span className="text-red-400">#f0f0f0</span>; {'}'}
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-pink-400 font-bold">&lt;?php</span> echo{' '}
          <span className="text-red-400">'Hello PHP!'</span>;
          <span className="text-pink-400 font-bold">?&gt;</span>
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-blue-400 font-bold">public void</span>{' '}
          <span className="text-orange-400">run</span>() {'{ '}
          <span className="text-purple-400">System.out.println</span>('Java'); {'}'}
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-purple-400">const</span>{' '}
          <span className="text-orange-400">sum</span> = (a, b) =&gt; a + b;
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-purple-400">console.log</span>('Développement');
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-blue-400 font-bold">if</span> (isActive) {'{ '}start(); {' }'}
        </span>
      )
    },
    {
      code: (
        <span className="text-white">
          <span className="text-purple-400">.container</span> {'{ '}
          <span className="text-green-400">display:</span> flex; {'}'}
        </span>
      )
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none font-mono text-lg">
      {functions.map(({ code }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${(i * 12) + 5}%`,
            left: `${(i * 30) % 100}%`,
            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.6))',
            whiteSpace: 'nowrap',
          }}
          animate={{
            y: ['0%', '-20%', '0%'],
            x: ['0%', '15%', '0%'],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.2,
          }}
        >
          {code}
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ title: '', description: '', category: '', code: '' });
  const [snippets, setSnippets] = useState([]);
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => { fetchSnippets(); }, [filter]);

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
      showNotification("Erreur lors de l'ajout", 'error');
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
    <div className="min-h-screen relative overflow-hidden">
      {/* 🎨 Fond noir animé */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute w-full h-full bg-black" />
        <div className="absolute w-full h-full bg-[url('https://transparenttextures.com/patterns/asfalt-light.png')] opacity-10" />
        <div className="absolute w-full h-full overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white bg-opacity-20 rounded-full animate-bubble"
              style={{
                width: `${Math.random() * 80 + 30}px`,
                height: `${Math.random() * 80 + 30}px`,
                left: `${Math.random() * 100}%`,
                bottom: `-${Math.random() * 200}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${18 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
      </div>

      <Stars count={150} />
      <FloatingFunctions />

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

      <h1 className="text-5xl font-bold text-center text-blue-300 mb-12 drop-shadow">
        💡 1Fonction - Snippets Hub
      </h1>

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

      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        {snippets.length === 0 && (
          <p className="text-center text-gray-300 text-lg">Aucun snippet trouvé.</p>
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
              <pre className="bg-gray-900 text-white rounded p-3 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                {snippet.code}
              </pre>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
