import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Github, Globe, ThumbsUp } from 'lucide-react';
import Stars from '../components/Stars';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function ProyectoDetalle() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projectRes, actionsRes] = await Promise.all([
          fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/projects/${id}`), // Assuming this endpoint still exists to get main project data
          api.listActions(id)
        ]);

        if (!projectRes.ok) throw new Error('No se pudo cargar el proyecto.');
        
        const projectData = await projectRes.json();
        setProject(projectData);
        setActions(actionsRes);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const { comments, votes, voteCount, userHasVoted } = useMemo(() => {
    const comments = actions.filter(a => a.type === 'comment');
    const votes = actions.filter(a => a.type === 'vote');
    const voteCount = votes.length;
    const userHasVoted = user ? votes.some(v => v.authorId === user.id) : false;
    return { comments, votes, voteCount, userHasVoted };
  }, [actions, user]);

  const handleVote = async () => {
    if (!isLoggedIn) {
      return navigate(`/login`, { state: { from: `/projects/${id}` } });
    }
    setIsVoting(true);
    try {
      const newVote = await api.addVote({ projectId: id, user });
      // Add vote to local state for immediate feedback
      setActions(currentActions => [...currentActions, newVote]);
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Error al registrar el voto.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentSubmitted = (newComment) => {
    setActions(prev => [newComment, ...prev]);
  };

  const LoginPrompt = ({ actionText }) => (
    <div className="text-center p-4 bg-brand-50 rounded-lg border border-border mt-4">
      <p className="text-sm text-muted">Debes <Link to={`/login?redirect=/projects/${id}`} className="font-bold text-brand hover:underline">iniciar sesión</Link> para {actionText}.</p>
    </div>
  );

  if (loading) return <main className="container mx-auto max-w-6xl px-4 py-8">Cargando proyecto...</main>;
  if (error) return <main className="container mx-auto max-w-6xl px-4 py-8 text-center error-text">{error}</main>;
  if (!project) return <main className="container mx-auto max-w-6xl px-4 py-8 text-center">Proyecto no encontrado.</main>;

  const technologies = (project.technologies || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link to="/projects" className="btn btn-ghost btn-sm">&larr; Volver a Proyectos</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="card p-6 sm:p-8">
            <p className="text-brand-600 font-semibold">{project.category}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mt-1">{project.name}</h1>
            <p className="text-muted mt-3 text-base">{project.description}</p>
                          <div className="mt-6">
                            <img
                              src={project.imageUrl ? `http://localhost:3001${project.imageUrl}` : 'https://placehold.co/800x500/8aa2f0/1f2937?text=Sin+Imagen'}
                              alt={project.name}
                              className="w-full h-auto object-cover rounded-xl border border-border"
                            />
                          </div>
            
                          {project.gallery && project.gallery.length > 0 && (
                            <div className="mt-6">
                              <h2 className="text-2xl font-bold tracking-tight text-ink">Galería</h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                {project.gallery.map(image => (
                                  <a key={image.id} href={`http://localhost:3001${image.imagenUrl}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={`http://localhost:3001${image.imagenUrl}`}
                                      alt={project.name}
                                      className="w-full h-auto object-cover rounded-lg border border-border"
                                    />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}          </div>

          <div className="card p-6 sm:p-8 comments-section">
            <h2 className="h-title text-2xl">Comentarios</h2>
            {isLoggedIn ? (
              <CommentForm projectId={id} onCommentSubmitted={handleCommentSubmitted} />
            ) : (
              <LoginPrompt actionText="dejar un comentario" />
            )}
            <div className="space-y-4 mt-6">
              {comments.map(comment => (
                <div key={comment.id} className="p-3 bg-bg rounded-lg border border-border text-sm">
                  <p className="text-ink">{comment.content}</p>
                  <div className="text-xs text-muted mt-2 flex items-center justify-between">
                    <span>Por: <strong>{comment.authorName}</strong></span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-muted text-sm text-center py-4">Aún no hay comentarios. ¡Sé el primero!</p>}
            </div>
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="card p-5 space-y-6 sticky top-24 sidebar">
            <div className="space-y-3">
              <h4 className="font-bold text-lg">Votar por este proyecto</h4>
              <button onClick={handleVote} disabled={isVoting || userHasVoted} className="btn btn-primary w-full">
                <ThumbsUp className="w-4 h-4" /> 
                {userHasVoted ? 'Ya votaste' : 'Apoyar este proyecto'}
              </button>
              <p className="text-sm text-muted text-center">{voteCount} personas han apoyado este proyecto.</p>
            </div>

            {(project.githubUrl || project.websiteUrl) && (
              <div className="border-t border-border pt-5 space-y-3">
                <h4 className="font-bold text-lg">Enlaces</h4>
                {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full"><Globe className="w-4 h-4" /> Ver Proyecto</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full"><Github className="w-4 h-4" /> Ver Repositorio</a>}
              </div>
            )}

            <div className="border-t border-border pt-5">
              <h4 className="font-bold text-lg mb-3">Tecnologías</h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => <span key={tech} className="pill">{tech}</span>)}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}