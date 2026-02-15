import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function BMICalculator() {
    const [h, setH] = useState('');
    const [w, setW] = useState('');
    const [bmi, setBmi] = useState(null);
    const [cat, setCat] = useState('');
    const resRef = useRef(null);

    const calc = (e) => {
        e.preventDefault();
        const hm = parseFloat(h) / 100;
        const wk = parseFloat(w);
        if (!hm || !wk) return;
        const v = (wk / (hm * hm)).toFixed(1);
        setBmi(v);
        setCat(v < 18.5 ? 'Underweight' : v < 25 ? 'Normal' : v < 30 ? 'Overweight' : 'Obese');
        if (resRef.current) gsap.fromTo(resRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
    };

    const catColor = { Underweight: 'text-info', Normal: 'text-neon', Overweight: 'text-warning', Obese: 'text-danger' };

    return (
        <div className="glass p-6">
            <h3 className="font-outfit font-bold text-lg mb-4">BMI Calculator</h3>
            <form onSubmit={calc} className="space-y-3">
                <input type="number" value={h} onChange={e => setH(e.target.value)} placeholder="Height (cm)" className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" required />
                <input type="number" value={w} onChange={e => setW(e.target.value)} placeholder="Weight (kg)" className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" required />
                <button type="submit" className="w-full py-3 btn-neon text-sm">Calculate</button>
            </form>
            {bmi && (
                <div ref={resRef} className="mt-4 text-center">
                    <p className={`font-outfit font-black text-4xl ${catColor[cat]}`}>{bmi}</p>
                    <p className={`font-semibold ${catColor[cat]}`}>{cat}</p>
                </div>
            )}
        </div>
    );
}
