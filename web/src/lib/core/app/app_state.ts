import { State } from "../state/state";

export interface IQueueState {
    name: string;
}

export class QueueState extends State<IQueueState> {
    private name = "";

    public get data() {
        return {
            name: this.name
        }
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }
}