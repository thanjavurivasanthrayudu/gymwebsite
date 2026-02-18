import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiX, FiPlay } from 'react-icons/fi';

export default function WorkoutModal({ workout, onClose }) {
    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalRef.current, { scale: 0.8, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }, []);

    const handleClose = () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(modalRef.current, { scale: 0.8, opacity: 0, y: 40, duration: 0.3, onComplete: onClose });
    };

    if (!workout) return null;

    const diffColor = { beginner: 'text-neon', intermediate: 'text-warning', advanced: 'text-danger' };

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={handleClose}>
            <div ref={modalRef} className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                    <h3 className="font-outfit font-bold text-xl">{workout.title}</h3>
                    <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-dark-lighter flex items-center justify-center hover:bg-danger/20 hover:text-danger transition-colors"><FiX /></button>
                </div>

                <div className="px-6 pt-4">
                    {workout.gifUrl ? (
                        <img src={workout.gifUrl} alt={workout.title} className="w-full h-48 object-cover rounded-xl bg-dark-lighter" />
                    ) : (
                        <div className="relative w-full h-48 bg-dark-lighter rounded-xl overflow-hidden">
                            <img
                                src={`/assets/images/exercises/${encodeURIComponent(workout.bodyPart || workout.muscleGroup || 'Chest')}/default.jpg`}
                                alt={workout.title}
                                className="w-full h-100 object-cover"
                                style={{ height: '100%', width: '100%' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                            {workout.videoUrl && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors">
                                    <a href={workout.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 btn-neon px-6 py-3"><FiPlay /> Watch Video</a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-gray-text text-sm">{workout.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-dark-lighter rounded-xl p-3">
                            <p className="text-xs text-gray">Muscle Group</p>
                            <p className="font-semibold capitalize text-sm">{workout.muscleGroup}</p>
                        </div>
                        <div className="bg-dark-lighter rounded-xl p-3">
                            <p className="text-xs text-gray">Difficulty</p>
                            <p className={`font-semibold capitalize text-sm ${diffColor[workout.difficulty]}`}>{workout.difficulty}</p>
                        </div>
                        <div className="bg-dark-lighter rounded-xl p-3">
                            <p className="text-xs text-gray">Sets × Reps</p>
                            <p className="font-semibold text-sm">{workout.sets} × {workout.reps}</p>
                        </div>
                        <div className="bg-dark-lighter rounded-xl p-3">
                            <p className="text-xs text-gray">Rest</p>
                            <p className="font-semibold text-sm">{workout.restTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
