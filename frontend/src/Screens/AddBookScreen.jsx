import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import api from '../../api/api';
import addBookAnimation from '../assets/animations/Books stack (1).json';

const AddBookScreen = () => {
    const navigate = useNavigate();

    const [titre, setTitre] = useState('');
    const [auteurId, setAuteurId] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [couverture, setCouverture] = useState(null);
    const [preview, setPreview] = useState(null);

    const [auteurs, setAuteurs] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [erreur, setErreur] = useState('');
    const [succes, setSucces] = useState('');

    const options = {
        animationData: addBookAnimation,
        loop: true,
    };
    const { View } = useLottie(options);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const resAuteurs = await api.get('auteurs/');
                const resCategories = await api.get('categories/');
                setAuteurs(resAuteurs.data);
                setCategories(resCategories.data);
                
                if (resAuteurs.data.length > 0) setAuteurId(resAuteurs.data[0].id);
                if (resCategories.data.length > 0) setCategorieId(resCategories.data[0].id);
            } catch (error) {
                setErreur("Veuillez d'abord créer des auteurs et catégories dans le panel Admin.");
            }
        };
        fetchOptions();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCouverture(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        if (!titre || !auteurId || !categorieId) {
            setErreur("Tous les champs marqués d'une * sont obligatoires.");
            return;
        }

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('auteur', auteurId);
        formData.append('categorie', categorieId);
        if (couverture) formData.append('couverture', couverture);

        try {
            await api.post('livres/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSucces("Livre ajouté avec succès !");
            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            setErreur("Erreur : Vérifiez que les auteurs et catégories existent en base.");
        }
    };

    return (
        <div className="addbook-container">
            <div className="addbook-card">
                <div className="addbook-logo">{View}</div>
                <h2 className="addbook-title">Nouveau Livre</h2>
                
                {erreur && <p className="addbook-error">{erreur}</p>}
                {succes && <p className="addbook-success">{succes}</p>}

                <form onSubmit={handleSubmit} className="addbook-form">
                    <div className="input-group">
                        <label className="input-label">Titre *</label>
                        <input 
                            type="text" 
                            className="form-input"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Titre de l'œuvre"
                        />
                    </div>

                    <div className="row-group">
                        <div className="input-group half">
                            <label className="input-label">Auteur *</label>
                            <select className="form-select" value={auteurId} onChange={(e) => setAuteurId(e.target.value)}>
                                {auteurs.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
                            </select>
                        </div>
                        <div className="input-group half">
                            <label className="input-label">Catégorie *</label>
                            <select className="form-select" value={categorieId} onChange={(e) => setCategorieId(e.target.value)}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Couverture</label>
                        <div className="file-area">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" id="cover-upload" />
                            <label htmlFor="cover-upload" className="file-label">
                                Choisir une image
                            </label>
                            {preview && <img src={preview} alt="Aperçu" className="image-preview" />}
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={() => navigate('/home')} className="btn-cancel">Annuler</button>
                        <button type="submit" className="btn-submit">Enregistrer</button>
                    </div>
                </form>
            </div>

            <style>{`
                .addbook-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%);
                    padding: 20px;
                    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
                }

                .addbook-card {
                    background: #ffffff;
                    padding: 32px;
                    border-radius: 32px;
                    box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.02);
                    width: 100%;
                    max-width: 560px;
                    transition: transform 0.2s ease;
                }

                .addbook-logo {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 8px;
                }

                .addbook-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    text-align: center;
                    margin-bottom: 24px;
                    letter-spacing: -0.01em;
                }

                .addbook-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .input-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #334155;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .form-input,
                .form-select {
                    width: 100%;
                    padding: 12px 16px;
                    font-size: 0.95rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 16px;
                    background-color: #ffffff;
                    transition: all 0.2s ease;
                    outline: none;
                    font-family: inherit;
                    color: #0f172a;
                }

                .form-input:focus,
                .form-select:focus {
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
                }

                .form-input::placeholder {
                    color: #94a3b8;
                    font-weight: 400;
                }

                .row-group {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .half {
                    flex: 1;
                    min-width: 140px;
                }

                /* File upload area */
                .file-area {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-top: 4px;
                }

                .file-input {
                    display: none;
                }

                .file-label {
                    background-color: #f1f5f9;
                    border: 1.5px dashed #cbd5e1;
                    border-radius: 40px;
                    padding: 10px 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #1e293b;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-block;
                }

                .file-label:hover {
                    background-color: #e6edf5;
                    border-color: #4f46e5;
                    color: #4f46e5;
                }

                .image-preview {
                    width: 56px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s;
                }

                .image-preview:hover {
                    transform: scale(1.02);
                }

                /* Buttons */
                .button-group {
                    display: flex;
                    gap: 16px;
                    margin-top: 8px;
                }

                .btn-cancel,
                .btn-submit {
                    flex: 1;
                    padding: 12px 8px;
                    border-radius: 40px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    font-family: inherit;
                }

                .btn-cancel {
                    background: transparent;
                    border: 1.5px solid #e2e8f0;
                    color: #475569;
                }

                .btn-cancel:hover {
                    background: #fef2f2;
                    border-color: #f97316;
                    color: #ea580c;
                }

                .btn-submit {
                    background: #4f46e5;
                    color: white;
                    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
                }

                .btn-submit:hover {
                    background: #4338ca;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 18px rgba(79, 70, 229, 0.25);
                }

                .btn-submit:active {
                    transform: translateY(1px);
                }

                /* Messages */
                .addbook-error {
                    background: #fef2f2;
                    color: #b91c1c;
                    padding: 12px 16px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    margin-bottom: 20px;
                    border-left: 4px solid #ef4444;
                    font-weight: 500;
                }

                .addbook-success {
                    background: #ecfdf5;
                    color: #065f46;
                    padding: 12px 16px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    margin-bottom: 20px;
                    border-left: 4px solid #10b981;
                    font-weight: 500;
                }

                @media (max-width: 500px) {
                    .addbook-card {
                        padding: 24px;
                    }
                    .row-group {
                        flex-direction: column;
                        gap: 12px;
                    }
                    .button-group {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default AddBookScreen;