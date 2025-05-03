const express = require('express');
const axios = require('axios');
const app = express();

// Middleware pour analyser les données JSON
app.use(express.json());
app.use(express.static('public')); // Dossier pour les fichiers statiques (HTML, CSS)

// Ta clé RapidAPI
const RAPIDAPI_KEY = 'ab42dda446mshde4ba65d25b85fdp13b83ejsn3965c0519b7d';

// Endpoint pour télécharger la vidéo
app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('URL manquante');
    }

    try {
        // Exemple avec YouTube, tu peux ajouter d'autres plateformes comme TikTok
        const response = await axios.post('https://youtube-media-downloader.p.rapidapi.com/v2/misc/list-items', 
            `url=${encodeURIComponent(url)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
                    'x-rapidapi-key': RAPIDAPI_KEY
                }
            }
        );

        // Vérification si l'API retourne bien un lien de téléchargement
        const videoLink = response.data.videos[0]?.url;
        if (!videoLink) {
            return res.status(404).send('Vidéo non trouvée');
        }

        // Renvoie l'URL de téléchargement à l'utilisateur
        return res.json({ downloadUrl: videoLink });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur lors de l\'appel à l\'API');
    }
});

// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
