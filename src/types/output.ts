import { entity } from "./entity";
import { Event, Timetable } from "../classes";

export interface finalOutput {
	oldSatisfaction: number;
	newSatisfaction: number;
	scenarios: scenario[];
}

export interface scenario {
	globalSatisfaction: number;
	entities: entityResult[];
	timetable: Timetable;
}

export interface entityResult extends entity {
	satisfaction: number;
}
