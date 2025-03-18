import "./queue.scss";
import Conversion from "./components/conversion";
import Checkbox from "@/components/ui/checkbox";
import { useLibState } from "@/lib/core/state/manager";
import { IQueueState } from "@/lib/core/app/app_state";
import { app } from "@/lib";
import { useState } from "react";

export default function Queue() {
    const convs = useLibState<IQueueState>(app.state.reducers.queue);
    const [checked, setChecked] = useState<string[]>([]);

    function updateSelectionList(id: string, state: boolean) {
        if (state) {
            setChecked([...checked, id]);
        } else {
            setChecked(checked.filter((i) => i !== id));
        }
    }

    function checkAll() {
        if (checked.length >= convs.queue.size) {
            setChecked([]);
        } else {
            setChecked(Array.from(convs.queue.values().map((c) => c.id)));
        }
    }

    return (
        <div id="queue">
            <div id="queue__header">
                <span>Conversion queue</span>
                <span>0 / 3</span>
            </div>
            <div id="queue__table">
                <table>
                    <thead>
                        <tr>
                            <th><Checkbox onChange={() => checkAll()} isChecked={convs.queue.size >= 1 && convs.queue.size === checked.length ? true : null} isIndeterminate={checked.length > 0 && checked.length < convs.queue.size} /></th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Format</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {convs.queue.values().map((conv) => (
                            <tr>
                                <Conversion isChecked={checked.includes(conv.id) || false} onCheck={(state) => updateSelectionList(conv.id, state)} id={conv.id} name={conv.name} size={conv.size} status={conv.status} format={conv.format} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}