import { classObject, event, teacherObject } from "../types";

export function evalGlobalSatisfaction(
	teachers: teacherObject[],
	classes: classObject[],
	options: {
		teacherWeight: number;
		classesWeight: number;
	} = { teacherWeight: 1, classesWeight: 1 }
): number {
	const { teacherWeight, classesWeight } = options;
	let globalSatis = 0;
	teachers.forEach(
		(t) => (globalSatis += evalSatisfaction(t.timetable) * teacherWeight)
	);
	classes.forEach(
		(c) => (globalSatis += evalSatisfaction(c.timetable) * classesWeight)
	);
	return globalSatis;
}

export function evalEntitySatisfaction(
	entities: (teacherObject | classObject)[]
): [sum: number, avg: number] {
	let sum = 0;
	entities.forEach((e) => {
		const eSatis = evalSatisfaction(e.timetable);
		sum += eSatis;
	});
	const avg = sum / entities.length;
	return [sum, avg];
}

export function evalSatisfaction(timetable: event[]): number {
	let satis = 100;
	if (timetable === []) return satis;
	satis += getTrimBonus(timetable);
	satis += getGapMalus(timetable);
	return satis;
}

export function getTrimBonus(timetable: event[]): number {
	let satis = 0;
	const NotEmpty = {};
	// First hours of the day
	try {
		timetable.forEach((e) => {
			if (!e.empty) throw NotEmpty;
			// Add points until a non-empty event is found
			satis += 20;
		});
	} catch (err) {
		if (err !== NotEmpty) throw err;
	}
	// Last hours of the day
	try {
		timetable.forEach((e, i, a) => {
			const l = a[a.length - 1 - i];
			if (!l.empty) throw NotEmpty;
			// Add points until a non-empty event is found
			satis += 10;
		});
	} catch (err) {
		if (err !== NotEmpty) throw err;
	}
	return satis;
}

export function getGapMalus(timetable: event[]): number {
	let gapSatis = 0;
	timetable.forEach((e, i, a) => {
		const [before, after] = [a[i - 1], a[i + 1]];
		const firstHalf = i <= a.length / 2;
		const lastHalf = i > a.length / 2;
		if (firstHalf && after.empty) gapSatis -= 10;
		if (lastHalf && before.empty) gapSatis -= 10;
	});
	return gapSatis;
}
