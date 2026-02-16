// Curated Gym Exercise Dataset - Based on Kaggle gym-exercise-data
// Columns: title, desc, type, bodyPart, equipment, level, rating

export const exerciseData = [
    // ─── Chest ──────────────────────
    { id: 1, title: 'Barbell Bench Press - Medium Grip', desc: 'Lie on a flat bench, grip the barbell slightly wider than shoulder-width. Lower to chest and press up.', type: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', level: 'Intermediate', rating: 9.2 },
    { id: 2, title: 'Dumbbell Flyes', desc: 'Lie on a flat bench with dumbbells extended above you. Lower arms in an arc motion until chest stretch is felt.', type: 'Strength', bodyPart: 'Chest', equipment: 'Dumbbell', level: 'Intermediate', rating: 8.5 },
    { id: 3, title: 'Push-Ups', desc: 'Start in plank position, lower body until chest nearly touches the floor, then press back up.', type: 'Strength', bodyPart: 'Chest', equipment: 'Body Only', level: 'Beginner', rating: 9.0 },
    { id: 4, title: 'Incline Dumbbell Press', desc: 'Lie on an incline bench, press dumbbells from shoulder height to full extension.', type: 'Strength', bodyPart: 'Chest', equipment: 'Dumbbell', level: 'Intermediate', rating: 8.8 },
    { id: 5, title: 'Cable Crossover', desc: 'Stand between cable machines, pull handles together in front of chest in an arc motion.', type: 'Strength', bodyPart: 'Chest', equipment: 'Cable', level: 'Intermediate', rating: 8.3 },
    { id: 6, title: 'Decline Barbell Bench Press', desc: 'Lie on a decline bench and perform bench press. Targets lower chest fibers.', type: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', level: 'Intermediate', rating: 8.1 },
    { id: 7, title: 'Machine Chest Press', desc: 'Sit on machine, press handles forward until arms are extended.', type: 'Strength', bodyPart: 'Chest', equipment: 'Machine', level: 'Beginner', rating: 7.5 },
    { id: 8, title: 'Dips - Chest Version', desc: 'Using parallel bars, lean forward and lower body, then press back up. Emphasize chest.', type: 'Strength', bodyPart: 'Chest', equipment: 'Body Only', level: 'Intermediate', rating: 8.7 },

    // ─── Back ───────────────────────
    { id: 9, title: 'Pull-Ups', desc: 'Hang from a bar with overhand grip, pull yourself up until chin clears the bar.', type: 'Strength', bodyPart: 'Back', equipment: 'Body Only', level: 'Intermediate', rating: 9.4 },
    { id: 10, title: 'Barbell Deadlift', desc: 'Stand behind barbell, grip it, and lift by extending hips and knees to standing position.', type: 'Strength', bodyPart: 'Back', equipment: 'Barbell', level: 'Intermediate', rating: 9.5 },
    { id: 11, title: 'Bent Over Barbell Row', desc: 'Bend at hips, grip barbell, pull it toward lower chest while keeping back straight.', type: 'Strength', bodyPart: 'Back', equipment: 'Barbell', level: 'Intermediate', rating: 9.0 },
    { id: 12, title: 'Lat Pulldown', desc: 'Sit at lat pulldown machine, pull bar down to upper chest while squeezing shoulder blades.', type: 'Strength', bodyPart: 'Back', equipment: 'Cable', level: 'Beginner', rating: 8.6 },
    { id: 13, title: 'Seated Cable Rows', desc: 'Sit at cable row machine, pull handle toward midsection, squeeze shoulder blades.', type: 'Strength', bodyPart: 'Back', equipment: 'Cable', level: 'Beginner', rating: 8.4 },
    { id: 14, title: 'T-Bar Row', desc: 'Straddle the T-bar, grip handles, and row the weight up toward your chest.', type: 'Strength', bodyPart: 'Back', equipment: 'Barbell', level: 'Intermediate', rating: 8.3 },
    { id: 15, title: 'One-Arm Dumbbell Row', desc: 'Place one knee and hand on bench, row dumbbell up with the other arm.', type: 'Strength', bodyPart: 'Back', equipment: 'Dumbbell', level: 'Beginner', rating: 8.7 },
    { id: 16, title: 'Chin-Ups', desc: 'Hang from bar with underhand grip, pull up until chin clears bar.', type: 'Strength', bodyPart: 'Back', equipment: 'Body Only', level: 'Intermediate', rating: 9.1 },

    // ─── Shoulders ──────────────────
    { id: 17, title: 'Military Press', desc: 'Press barbell overhead from shoulder height to full arm extension while standing.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Barbell', level: 'Intermediate', rating: 9.0 },
    { id: 18, title: 'Dumbbell Lateral Raise', desc: 'Stand with dumbbells at sides, raise arms out to sides until parallel to floor.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Dumbbell', level: 'Beginner', rating: 8.5 },
    { id: 19, title: 'Arnold Press', desc: 'Seated with dumbbells at chin level, rotate palms while pressing overhead.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Dumbbell', level: 'Intermediate', rating: 8.8 },
    { id: 20, title: 'Face Pulls', desc: 'Using a rope on a cable machine, pull toward face while externally rotating shoulders.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Cable', level: 'Beginner', rating: 8.6 },
    { id: 21, title: 'Front Dumbbell Raise', desc: 'Stand with dumbbells at thighs, raise one arm at a time to shoulder height.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Dumbbell', level: 'Beginner', rating: 7.8 },
    { id: 22, title: 'Upright Barbell Row', desc: 'Hold barbell at thighs with overhand grip, pull up along body to chin.', type: 'Strength', bodyPart: 'Shoulders', equipment: 'Barbell', level: 'Intermediate', rating: 7.9 },

    // ─── Arms ───────────────────────
    { id: 23, title: 'Barbell Curl', desc: 'Stand with barbell at arm length, curl weight up by bending elbows.', type: 'Strength', bodyPart: 'Arms', equipment: 'Barbell', level: 'Beginner', rating: 8.8 },
    { id: 24, title: 'Tricep Dips', desc: 'On parallel bars or bench, lower body by bending elbows, then press back up.', type: 'Strength', bodyPart: 'Arms', equipment: 'Body Only', level: 'Intermediate', rating: 8.7 },
    { id: 25, title: 'Hammer Curls', desc: 'Stand with dumbbells, palms facing each other, curl weight up.', type: 'Strength', bodyPart: 'Arms', equipment: 'Dumbbell', level: 'Beginner', rating: 8.5 },
    { id: 26, title: 'Skull Crushers', desc: 'Lie on bench, hold barbell or EZ bar above, lower to forehead then extend.', type: 'Strength', bodyPart: 'Arms', equipment: 'Barbell', level: 'Intermediate', rating: 8.4 },
    { id: 27, title: 'Cable Tricep Pushdown', desc: 'Stand at cable machine, push rope or bar down by extending elbows.', type: 'Strength', bodyPart: 'Arms', equipment: 'Cable', level: 'Beginner', rating: 8.3 },
    { id: 28, title: 'Concentration Curl', desc: 'Sit on bench, rest elbow on inner thigh, curl dumbbell up.', type: 'Strength', bodyPart: 'Arms', equipment: 'Dumbbell', level: 'Beginner', rating: 8.2 },
    { id: 29, title: 'Preacher Curl', desc: 'Using preacher bench, curl barbell or dumbbell with upper arms resting on pad.', type: 'Strength', bodyPart: 'Arms', equipment: 'Barbell', level: 'Intermediate', rating: 8.1 },
    { id: 30, title: 'Overhead Tricep Extension', desc: 'Hold dumbbell with both hands overhead, lower behind head and extend back up.', type: 'Strength', bodyPart: 'Arms', equipment: 'Dumbbell', level: 'Beginner', rating: 7.9 },

    // ─── Legs ───────────────────────
    { id: 31, title: 'Barbell Squat', desc: 'Place barbell on upper back, squat down until thighs are parallel, then stand back up.', type: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', level: 'Intermediate', rating: 9.6 },
    { id: 32, title: 'Leg Press', desc: 'Sit on leg press machine, push platform away by extending knees and hips.', type: 'Strength', bodyPart: 'Legs', equipment: 'Machine', level: 'Beginner', rating: 8.8 },
    { id: 33, title: 'Walking Lunges', desc: 'Step forward into lunge, alternate legs as you walk forward.', type: 'Strength', bodyPart: 'Legs', equipment: 'Body Only', level: 'Beginner', rating: 8.7 },
    { id: 34, title: 'Romanian Deadlift', desc: 'Hold barbell at hips, hinge forward keeping legs nearly straight to feel hamstring stretch.', type: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', level: 'Intermediate', rating: 9.0 },
    { id: 35, title: 'Leg Curl', desc: 'Lie face down on leg curl machine, curl weight up by bending knees.', type: 'Strength', bodyPart: 'Legs', equipment: 'Machine', level: 'Beginner', rating: 7.8 },
    { id: 36, title: 'Leg Extension', desc: 'Sit on leg extension machine, extend legs until straight.', type: 'Strength', bodyPart: 'Legs', equipment: 'Machine', level: 'Beginner', rating: 7.6 },
    { id: 37, title: 'Calf Raises', desc: 'Stand on edge of platform, rise up on toes then lower heels below platform.', type: 'Strength', bodyPart: 'Legs', equipment: 'Machine', level: 'Beginner', rating: 7.5 },
    { id: 38, title: 'Bulgarian Split Squat', desc: 'Place rear foot on bench, squat down on front leg until thigh is parallel.', type: 'Strength', bodyPart: 'Legs', equipment: 'Dumbbell', level: 'Intermediate', rating: 8.9 },
    { id: 39, title: 'Goblet Squat', desc: 'Hold dumbbell or kettlebell at chest level, squat down and stand back up.', type: 'Strength', bodyPart: 'Legs', equipment: 'Dumbbell', level: 'Beginner', rating: 8.4 },
    { id: 40, title: 'Hip Thrust', desc: 'Sit with upper back against bench, place barbell across hips, thrust upward.', type: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', level: 'Intermediate', rating: 9.1 },

    // ─── Core ───────────────────────
    { id: 41, title: 'Plank', desc: 'Hold push-up position on forearms, keeping body in a straight line.', type: 'Strength', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 9.0 },
    { id: 42, title: 'Hanging Leg Raise', desc: 'Hang from pull-up bar, raise legs until they are parallel to floor.', type: 'Strength', bodyPart: 'Core', equipment: 'Body Only', level: 'Intermediate', rating: 8.8 },
    { id: 43, title: 'Russian Twist', desc: 'Sit on floor with knees bent, lean back slightly and twist torso side to side.', type: 'Strength', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 8.2 },
    { id: 44, title: 'Ab Wheel Rollout', desc: 'Kneel on floor, grip ab wheel, roll forward extending body then roll back.', type: 'Strength', bodyPart: 'Core', equipment: 'Other', level: 'Intermediate', rating: 8.9 },
    { id: 45, title: 'Cable Woodchop', desc: 'Using cable machine, pull handle diagonally across body from high to low.', type: 'Strength', bodyPart: 'Core', equipment: 'Cable', level: 'Intermediate', rating: 8.1 },
    { id: 46, title: 'Bicycle Crunch', desc: 'Lie on back, bring opposite elbow to knee in a pedaling motion.', type: 'Strength', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 8.3 },
    { id: 47, title: 'Dead Bug', desc: 'Lie on back with arms and knees up, extend opposite arm and leg while keeping back flat.', type: 'Strength', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 8.0 },
    { id: 48, title: 'Mountain Climbers', desc: 'Start in plank, drive knees toward chest alternately in a running motion.', type: 'Cardio', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 8.5 },

    // ─── Cardio ─────────────────────
    { id: 49, title: 'Jump Rope', desc: 'Skip rope using both feet, maintain a steady rhythm. Great for cardio and coordination.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Other', level: 'Beginner', rating: 8.8 },
    { id: 50, title: 'Burpees', desc: 'From standing, squat down, kick feet back to plank, do push-up, jump feet in, jump up.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Body Only', level: 'Intermediate', rating: 9.0 },
    { id: 51, title: 'Box Jumps', desc: 'Stand in front of a box, jump up onto it landing with both feet, step back down.', type: 'Cardio', bodyPart: 'Legs', equipment: 'Other', level: 'Intermediate', rating: 8.5 },
    { id: 52, title: 'Rowing Machine', desc: 'Sit at rowing machine, drive with legs then pull handle to chest in smooth motion.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Machine', level: 'Beginner', rating: 8.7 },
    { id: 53, title: 'Treadmill Running', desc: 'Run on treadmill at desired speed and incline for steady-state or interval cardio.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Machine', level: 'Beginner', rating: 7.5 },
    { id: 54, title: 'Battle Ropes', desc: 'Hold ends of heavy ropes, create waves by alternating arm movements rapidly.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Other', level: 'Intermediate', rating: 8.6 },
    { id: 55, title: 'Kettlebell Swing', desc: 'Hinge at hips, swing kettlebell between legs then thrust hips to swing it to shoulder height.', type: 'Cardio', bodyPart: 'Full Body', equipment: 'Kettlebell', level: 'Intermediate', rating: 9.1 },
    { id: 56, title: 'Stair Climber', desc: 'Use stair climber machine, step at a challenging pace. Targets legs and cardiovascular system.', type: 'Cardio', bodyPart: 'Legs', equipment: 'Machine', level: 'Beginner', rating: 7.8 },

    // ─── Stretching / Yoga ──────────
    { id: 57, title: 'Standing Hamstring Stretch', desc: 'Stand and place one foot forward, hinge at hips to stretch the hamstring.', type: 'Stretching', bodyPart: 'Legs', equipment: 'Body Only', level: 'Beginner', rating: 7.5 },
    { id: 58, title: 'Cat-Cow Stretch', desc: 'On hands and knees, alternate between arching and rounding the spine.', type: 'Stretching', bodyPart: 'Back', equipment: 'Body Only', level: 'Beginner', rating: 8.0 },
    { id: 59, title: 'Pigeon Pose', desc: 'From plank, bring one knee forward and lower hips. Stretches hip flexors and glutes.', type: 'Stretching', bodyPart: 'Legs', equipment: 'Body Only', level: 'Beginner', rating: 8.2 },
    { id: 60, title: 'Downward Dog', desc: 'Form an inverted V-shape with hands and feet on floor. Stretches hamstrings, calves, and shoulders.', type: 'Stretching', bodyPart: 'Full Body', equipment: 'Body Only', level: 'Beginner', rating: 8.5 },
    { id: 61, title: 'Child\'s Pose', desc: 'Kneel and sit back on heels, extend arms forward on floor. A resting stretch.', type: 'Stretching', bodyPart: 'Back', equipment: 'Body Only', level: 'Beginner', rating: 8.0 },
    { id: 62, title: 'Warrior II', desc: 'Stand with legs wide, turn one foot out, bend that knee, extend arms. Builds leg strength.', type: 'Stretching', bodyPart: 'Legs', equipment: 'Body Only', level: 'Beginner', rating: 8.3 },
    { id: 63, title: 'Thread the Needle', desc: 'From all fours, reach one arm under body to stretch upper back and shoulders.', type: 'Stretching', bodyPart: 'Shoulders', equipment: 'Body Only', level: 'Beginner', rating: 7.8 },
    { id: 64, title: 'Cobra Stretch', desc: 'Lie face down, press upper body up with arms straight, arching the back.', type: 'Stretching', bodyPart: 'Core', equipment: 'Body Only', level: 'Beginner', rating: 8.1 },
];

// ─── Helper Functions ──────────────────────────────────

const allBodyParts = [...new Set(exerciseData.map(e => e.bodyPart))].sort();
const allLevels = ['Beginner', 'Intermediate', 'Expert'];
const allEquipment = [...new Set(exerciseData.map(e => e.equipment))].sort();
const allTypes = [...new Set(exerciseData.map(e => e.type))].sort();

export function getBodyParts() { return allBodyParts; }
export function getLevels() { return allLevels; }
export function getEquipmentList() { return allEquipment; }
export function getTypes() { return allTypes; }

export function getByBodyPart(bodyPart) {
    return exerciseData.filter(e => e.bodyPart === bodyPart);
}

export function getByLevel(level) {
    return exerciseData.filter(e => e.level === level);
}

export function getByEquipment(equipment) {
    return exerciseData.filter(e => e.equipment === equipment);
}

export function searchExercises(query) {
    const q = query.toLowerCase();
    return exerciseData.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.bodyPart.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q)
    );
}

export function filterExercises({ bodyPart, level, equipment, search } = {}) {
    return exerciseData.filter(e => {
        if (bodyPart && e.bodyPart !== bodyPart) return false;
        if (level && e.level !== level) return false;
        if (equipment && e.equipment !== equipment) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!e.title.toLowerCase().includes(q) && !e.desc.toLowerCase().includes(q)) return false;
        }
        return true;
    });
}
