import { entity } from "./entity";
import { Event } from "../classes";

export interface finalOutput {
	oldSatisfaction: number;
	newSatisfaction: number;
	scenarios: scenario[];
}

export interface scenario {
	globalSatisfaction: number;
	entities: entityResult[];
	timetable: Event[];
}

export interface entityResult extends entity {
	satisfaction: number;
}
