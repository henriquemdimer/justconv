import "./queue.scss";
import Conversion from "./components/conversion";

export default function Queue() {
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
                            <th>Name</th>
                            <th>Status</th>
                            <th>Format</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {new Array(20).fill('a').map(() => (
                            <tr>
                                <Conversion />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}